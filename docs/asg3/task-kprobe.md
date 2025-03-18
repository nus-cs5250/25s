# Task 1: Hook System Calls with KProbes

Before beginning, download and execute the `tetris` binary and get familiarized with the game.

## How Time Flies

In this game, the bricks fall from the top of the screen by one row at a specific time interval.
As you can imagine, there should be some mechanism to keep track of time and trigger the movement of the bricks.
This can be achieved in generally two ways:
One approach is to invoke a `sleep` system call to pause execution for the desired interval, then move the bricks when the process resumes.
Another approach is to set up a timer and registers a callback function to execute when the timer expires, and move the bricks in the callback function.

Since both methods require the use of system calls, let's use `strace` to observe how the game tracks time.
We can get an initial idea of `strace` by running the following command:

```
strace cat /dev/null
```

A list of system calls made by the `cat` command, together with their arguments and return values, will be printed.
However, if we run `strace ./tetris` directly, the output will be corrupted due to interleaved output both from the game and `strace`.
It would be helpful to write the output of `strace` to a file and inspect it later.

```
strace -o <filename> ./tetris
```

Give a filename of your choice to the `-o` option, execute the command, and enjoy the game for a while.
Then press `q` to quit the game and inspect the output file.

!!! question

    What is the name of the system call that the game uses to keep track of time?

Please read the man page of the system call, or ask ChatGPT if you need, to learn how to use it.
Write a small program to demonstrate the use of the system call.
(The program will be used to test the hooking mechanism later.)

The `strace` outputs many system calls.
To facilitate the analysis, some flag can be used to filter the output.
Read the man page of `strace` to find the flag that can be used to filter the output of `strace` to only show the system call you identified in the previous question.

!!! question

    Give the complete command to run `strace` so that:

    - The output is written to a file.
    - Only the system call that the game uses to keep track of time is shown.
    - It's fine if there are some other outputs not related to system calls, e.g., information about signals or exit status.

## Wait! It's Too fast!

Now that you have identified the system call the game uses to track time, let’s see if we can slow things down, giving you more time to make decisions.
Whether the game uses a sleep or a timer, the timing is always kept track of by the kernel.
That means the kernel either returns from the system call after a set duration or sends a signal to the process when the timer expires.
By intercepting this system call, we can tweak its arguments to extend the duration before the bricks move, effectively slowing down the game.

To achieve this, we'll employ a kernel feature known as KProbes.
KProbes allows inserting a probe at a specific kernel address and registering a callback function to be invoked when the probe is hit.
This callback function can modify the arguments and return value of the probed function, or even bypass the system call and return directly to the caller.

### A First Glance at KProbes

KProbe is implemented as a kernel module.
A simple example of a kernel module using KProbes is provided in the repository in the "task1/hook" directory.
This module intercepts the `__do_sys_ni_syscall` system call service routine and prints its arguments.

Lines 26-28 of the code implement a simple filter, ensuring the probe triggers only when the `current` process has a `comm` field matching the specified string argument `comm`.
When loading the module, you should provide an appropriate value to the `comm` argument to ensure the probe triggers only when the intended program is running.

Here's a user program that invokes `__do_sys_ni_syscall`.

```C
#include <unistd.h>

int main()
{
    syscall(423, 0x10, 0x20, 0x30, 0x40, 0x50, 0x60);
    return 0;
}
```

After building and loading the kernel module, execute the user program.
Then inspect the kernel log to observe the output of the kernel module.
You will find the arguments passed to `__do_sys_ni_syscall` there.

```
hook: --- [[ Module loaded ]] ---
hook: intercepted [20092] test
hook: pre_handler: __do_sys_ni_syscall@00000000243ec603
hook: rdi = 0x10
hook: rsi = 0x20
hook: rdx = 0x30
hook: r10 = 0x40
hook: r8  = 0x50
hook: r9  = 0x60
hook: --- [[ Module unloaded ]] ---
```

!!! question

    In the module, the first argument of the system call is accessed using `((struct pt_regs *)(regs->di))->di`.
    Why do we need such an indirection to retrieve the arguments of the system call instead of directly accessing `regs->di`?
    Please explain with a brief description of the call trace.

    Hint: <https://www.kernel.org/doc/html/v6.13/trace/kprobes.html#how-does-a-kprobe-work>

Take note of the address of the system call service routine.
You may find that it does not fall within the region of the "kernel text", as indicated in the [memory layout documentation](https://www.kernel.org/doc/html/v6.13/arch/x86/x86_64/mm.html).
Why is this the case? How can you fix this problem?

!!! question

    What is the problem with the address of the system call service routine?
    How can you fix this problem and print the real address of the system call service routine?

    Hint: <https://www.kernel.org/doc/html/v6.13/core-api/printk-formats.html>

!!! question

    Please fix this problem and print the real address of the system call service routine.
    This should be a one-line change in the kernel module.

### Find the Hook Point

To hook the system call, you need to find the symbol name of the service routine implementing the system call.
You've done this in Pop Quiz 6, and you can do it again.
However, with the `vmlinux` file available, you can use `gdb` to find the symbol name of the service routine.

```console
$ gdb vmlinux

<some output omitted here>

(gdb) print sys_call_table
$1 = {...}
```

This command prints the contents of the `sys_call_table` variable, which is a lengthy array of function pointers.
To locate the symbol name of the service routine, you can look up the syscall table to find the syscall number of the system call, and then print only that entry in the syscall table.

!!! question

    What is the GDB command to print the entry in the syscall table for the system call you identified in Question 1?

Having identified the symbol name of the service routine, you can proceed to modify the kernel module to hook the desired system call.
After modifying the kernel module, build it and load it into the kernel.
In a previous step, you wrote a small program to demonstrate the use of the system call.
Now, execute the program and review the kernel log to observe the output.

Now that we've successfully hooked the system call and accessed its arguments, we can modify them to extend the time before the bricks move again.

However, it might not be as simple as it seems to hook at the very beginning of the system call service routine.
One important argument is passed as a pointer to a user-space address.
Directly modifying this value in user space might trigger the game's cheat detection system, causing it to refuse execution.
To avoid this, it would be better to modify the value in kernel space.
But the control flow, after the pre-handler is executed, will return to the original service routine.
The original service routine assumes that the pointer still references a valid user-space address.
If the pointer instead references a kernel-space address, the original service routine could crash.

Let's find a workaround.

Locate the system call definition in the kernel source code and examine how it handles the arguments.
Can you identify another function to hook, where the important argument is already in kernel space?

!!! question

    Modify the kernel module to:

    - Hook the new function you found.
    - Increment the duration **by** one second. (Not "to" one second.)
    - Adjust the `MODULE_AUTHOR` to your name.

After loading the kernel module, run the game and observe if the time flows slower.
