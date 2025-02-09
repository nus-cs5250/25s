# Task 1: Debugging with GDB

!!! info

    Wherever we mention the "ABI documentation", we are referring to the document available at
    <https://refspecs.linuxfoundation.org/elf/x86_64-abi-0.99.pdf>.
    This link is also available on Canvas.

!!! info

    We assume you have some basic familiarity with GDB.
    If GDB is completely new to you, consider reviewing these resources from CS:APP beforehand:

    - Beej's Guide to GDB:
      <https://beej.us/guide/bggdb/>
    - An x86-64 GDB Cheat Sheet:
      <http://csapp.cs.cmu.edu/3e/docs/gdbnotes-x86-64.txt>

    For additional support, you might find the following resources helpful:

    - The Official GDB Manual, *Debugging with GDB*:
      <https://sourceware.org/gdb/current/onlinedocs/gdb/>

## Examining the Stack

Write a C program by creating a file named `hello.c` with the following content:

```c
// hello.c
#include <stdio.h>

int main() {
    printf("Hello, world!\n");
    return 0;
}
```

Compile the program using the command below.
The `-g` flag compiles your program with debug information, which is important for debugging.

```
gcc -Og -g -o hello hello.c
```

Run the compiled program using GDB with the command:

```
gdb ./hello
```

At this point, the program is loaded into GDB but has not started executing.
To begin execution up to the start of the `main` function, use the `start` command.

```
(gdb) start
```

Upon executing the `start` command, GDB will output something similar to:

```
Temporary breakpoint 1, main () at hello.c:4
```

This message indicates that a temporary breakpoint has been set at the beginning of the `main` function and the program is paused at this point.
You can examine the state of the program at this breakpoint.

To view the register values at this point, use the `info registers` command in GDB.
This command displays the current values of all registers.

```
(gdb) info registers
```

To examine the first 8 values on the stack in hexadecimal format, use the `x/8xg $rsp` command.
This command uses the `x` command to examine memory and prints 8 quadwords (`g` stands for giant/quadword) in hexadecimal format from the location pointed to by the stack pointer (`rsp`).

```
(gdb) x/8xg $rsp
```

Refer to **"Figure 3.4: Register Usage"** in the ABI documentation.
Check what the first three arguments passed to the
[`main` function](https://en.cppreference.com/w/c/language/main_function) are.
For help with format specifiers, check the GDB manual's section on
[Examining Memory](https://sourceware.org/gdb/current/onlinedocs/gdb.html/Memory.html).

To exit GDB, use the `quit` command.

Restart the `hello` program in GDB, this time using the `starti` command.
You'll notice the program pauses at `_start` instead of `main`.
What is the difference between `start` and `starti`?

Then, output the first few quadwords on the stack.
Among these, you'll identify values that appear to be addresses, not too far from the top of the stack.
Try printing the content at these addresses using various formats to understand what are they.

Finally, check the ABI documentation to verify your findings.

!!! question

    Which figure in the ABI documentation describes the stack layout for the initial state of a process?

## Attach GDB to Kernel via QEMU

Please build the kernel with the following TWO configuration options set:

Use the following command to start Linux kernel in QEMU.
The `-s` option configures QEMU to listen for a GDB connection on port 1234.
The `-S` option pauses the CPU at startup, providing an opportunity to connect with GDB prior to the kernel's execution.
Additionally, KASLR is disabled to simplify the debugging process.

```
qemu-system-x86_64 -s -S -nographic -kernel ./arch/x86/boot/bzImage -append 'console=ttyS0 nokaslr'
```

!!! info

    For more details on QEMU's
    [command-line options](https://www.qemu.org/docs/master/system/invocation.html)
    and
    [key bindings](https://www.qemu.org/docs/master/system/mux-chardev.html)
    in the character backend multiplexer, you can refer to the QEMU documentation.

Next, open a new terminal and start GDB.
Use the `vmlinux` file located in the root directory of the kernel source code.
This file is an uncompressed kernel image that includes debugging information.

```
gdb vmlinux
```

Inside GDB, connect to the GDB server in the active QEMU instance using:

```
(gdb) target remote localhost:1234
```

This allows you to set breakpoints, continue execution, and inspect the kernel's state.

!!! info

    You may find it troublesome to type the "target remote" commands every time you start GDB.
    To automate this process, you can create a file named, say, `gdbinit` with the following content:

    ```
    target remote localhost:1234
    ```

    Then, you can start GDB with the following command:

    ```
    gdb -x gdbinit vmlinux
    ```

    This will automatically execute the commands in `gdbinit` when GDB starts, i.e., connect to the QEMU instance.
    You may also add other commands to `gdbinit` to further automate the debugging process if needed.

For an initial exploration, let's monitor changes to the `jiffies_64` variable.
Use the `watch` command:

```
(gdb) watch jiffies_64
```

Continue the execution with:

```
(gdb) continue
```

The execution will pause when `jiffies_64` changes.

To analyse how `jiffies_64` is updated, use commands `info stack` or `backtrace` or `bt` to print the call stack.

```
(gdb) backtrace
#0  do_timer (ticks=ticks@entry=1) at kernel/time/timekeeping.c:2429
#1  0xffffffff8115e146 in tick_periodic (cpu=cpu@entry=0) at kernel/time/tick-common.c:95
#2  0xffffffff8115e18f in tick_handle_periodic (dev=0xffff888003857400) at kernel/time/tick-common.c:113
#3  0xffffffff81034ed3 in timer_interrupt (irq=<optimized out>, dev_id=<optimized out>) at arch/x86/kernel/time.c:39
#4  0xffffffff8110c615 in __handle_irq_event_percpu (desc=desc@entry=0xffff888003861e00) at kernel/irq/handle.c:158
#5  0xffffffff8110c7f3 in handle_irq_event_percpu (desc=0xffff888003861e00) at kernel/irq/handle.c:193
#6  handle_irq_event (desc=desc@entry=0xffff888003861e00) at kernel/irq/handle.c:210
#7  0xffffffff8111127b in handle_level_irq (desc=0xffff888003861e00) at kernel/irq/chip.c:648
#8  0xffffffff81033a19 in generic_handle_irq_desc (desc=<optimized out>) at ./include/linux/irqdesc.h:173
#9  handle_irq (regs=<optimized out>, desc=<optimized out>) at arch/x86/kernel/irq.c:247
#10 call_irq_handler (regs=<optimized out>, vector=<optimized out>) at arch/x86/kernel/irq.c:259
#11 __common_interrupt (regs=<optimized out>, vector=<optimized out>) at arch/x86/kernel/irq.c:285
#12 0xffffffff81f740da in common_interrupt (regs=0xffffffff82a03db8, error_code=<optimized out>) at arch/x86/kernel/irq.c:278
Backtrace stopped: Cannot access memory at address 0xffffc90000004010
```

The "#0" is the top of the stack, i.e. the current function.
That is, `common_interrupt` function calls `__common_interrupt` function, which
then calls a series of functions that eventually update `jiffies_64` in the `do_timer` function.

If you look at the source code of
[`generic_handle_irq_desc`](https://elixir.bootlin.com/linux/v6.13/source/include/linux/irqdesc.h#L171)
(#8) , you'll notice it invokes a method from `struct irq_desc`.
The stack trace shows that the `handle_level_irq` (#7) function is called from here.
This indicates that `handle_level_irq` is the method bound to `handle_irq` in this `struct irq_desc` instance.

The stack trace shows that `handle_level_irq` is invoked with an argument `0xffff888003861e00`, which is the address of an `irq_desc` object.
You can inspect this object in GDB:

```
(gdb) print *(struct irq_desc *)0xffff888003861e00
```

This command will interpret the memory contents at the specified address as a `irq_desc` object, allowing you to examine its properties.

!!! question

    Which interrupt line (IRQ) is allocated for this specific interrupt?

You might have encountered a warning indicating "auto-loading has been declined", it suggests that the script `vmlinux-gdb.py` provided by the kernel was not loaded successfully.
This script offers a range of commands to streamline kernel debugging.
For more information regarding this script, please refer to
[this page](https://www.kernel.org/doc/html/v6.13/dev-tools/gdb-kernel-debugging.html).
Please solve the problem by following the instructions provided in the warning message.

Now, let's start the kernel with an initial ramdisk so that it can properly switch to a user-space process.
Please drop to a shell directly within the `init` process.
You may follow the
[instructions](https://nus-cs5250.github.io/25s/asg1/task-boot/#create-an-initramfs-using-busybox)
from the previous assignment to create the initial ramdisk.

```
qemu-system-x86_64 -s -S -nographic -kernel ./arch/x86/boot/bzImage -append 'console=ttyS0 nokaslr' -initrd path/to/busybox.cpio.gz
```

There's a
[`user_mode_thread`](https://elixir.bootlin.com/linux/v6.13/source/init/main.c#L712)
function that is responsible for creating the first user-space process.
It requires that the new thread shall executes the
[`kernel_init`](https://elixir.bootlin.com/linux/v6.13/source/init/main.c#L1457)
function.
Please set breakpoints properly and explore how the first user-space process is launched.

!!! question

    How does the `/init` program get executed?
    Is this procedure similar to how `execve` works?
    Does a context switch occur, similar to what happens during a `syscall`?
    Please explain your observation briefly.
