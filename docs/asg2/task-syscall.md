# Task 3: Creating a New System Call

!!! info

    For this task, you need to make modifications to the kernel source code and generate a patch.
    This process should be carried out within the Git repository of the kernel source code, based on version 6.13.
    Please consult the instructions provided in
    [Assignment 1](../asg1/task-kbuild.md) for detailed guidance on cloning the Git repository.

!!! danger

    If you are using the course-provided server, kindly perform this task within your VM.
    **At no point should you attempt to install the kernel built by yourself directly in the server.**

## Greetings from a New System Call

Generate a file named "cs5250.c" within the "kernel/" directory in your Linux source tree.
Populate the file with the provided content.
You have the flexibility to be creative with the printed message, but ensure to include your Matriculation Number.

```C
#include <linux/kernel.h>
#include <linux/syscalls.h>

SYSCALL_DEFINE1(printmsg, int, i)
{
    pr_info("Hello! This is %d miles away from A0123456A\n", i);
    return 1;
}
```

The `SYSCALL_DEFINE1` macro is defined in "syscalls.h".
It expands into the function definition and additional facilities for kernel debugging.
The suffix "1" signifies that the function takes one argument.
For a syscall function with two parameters, use `SYSCALL_DEFINE2`.

Add the line `obj-y += cs5250.o` to the "Makefile" in the "kernel/" directory.
This ensures that the kernel includes your new program in the kernel image.

Find the table of function entries (Hint: it starts with "syscall") and append your function as a new entry at the end of the table.

Recompile the kernel and boot into the new kernel.

## Invoking the New System Call

To create a user-mode program that invokes your custom kernel function, here's a sample program template.
Make sure to replace `<the_index>` with the syscall number you were assigned for your custom system call during the previous steps.

```C
#include <unistd.h>
#include <sys/syscall.h>

// Replace <the_index> with your custom system call's actual syscall number.
#define __NR_printmsg <the_index>

int printmsg(int i) {
    // Invoke your custom system call using syscall.
    return syscall(__NR_printmsg, i);
}

int main(int argc, char **argv) {
    // Use the custom system call with an example argument, such as 668.
    printmsg(668);
    return 0;
}
```

After updating your program with the correct syscall number, compile and run it to trigger your custom system call.
Use `dmesg` to check the outputs and confirm its execution.

## Finding Children

The Linux kernel extensively employs linked lists.
The `struct task_struct` in the Linux kernel includes a `children` member, a `struct list_head` representing the head of a linked list of all child processes of a given process.

You will implement a new system call, `getcpid`, and a user-mode program.
In "cs5250.c", define the `getcpid` system call that accepts three arguments:

- A `pid_t` representing the PID of the process whose children you wish to retrieve.
- A pointer to an array of type `pid_t*` where the PIDs of the children will be stored.
- A `uint32_t` indicating the size of the array (in number of elements).

This system call should write the PIDs of the children of the specified process to the provided user space array.

For guidance on how the system call should behave, you can look at the interface of
[`getsockname`](https://man7.org/linux/man-pages/man2/getsockname.2.html).

Additionally, create a user-mode program that uses your custom kernel function.
This program should take the PID of a process as input and output the PIDs of all its children, one per line.

## "Contribute" to the Kernel

Please commit your changes and create a patch file[^1] that includes all essential changes related to the implementation of the new system call, using `git format-patch` command.
For guidance and reference, check the
[Git documentation](https://git-scm.com/docs/git-format-patch#_examples) and the
[Kernel documentation](https://www.kernel.org/doc/html/v6.13/process/submitting-patches.html).

Please adhere to the following guidelines for your submission:

1. Make sure your patch can be successfully applied to a clean clone of the kernel source tree, at version 6.13.
   If the patch fails to apply, this will lead to a score of zero for this task.
2. Ensure that the kernel compiles successfully after your patch is applied.
   Failure to compile the kernel will also result in a score of zero for this task.
3. Your patch must contain only the essential changes to the kernel source code required for implementing the new system call.
   Any deviation from this requirement will incur a penalty.
4. If your work results in multiple commits, please be aware that each commit corresponds to a separate patch file.
   You are required to combine these commits into a single commit and then generate a single patch file that includes all changes.

[^1]:
    This submission format is designed to offer an initial experience in the process of contributing to the Linux kernel.
    In future contributions to the Linux kernel, it will be imperative to generate a patch file including your changes and submit it for review to the community's mailing list.
    The intention is not to challenge your proficiency in using Git, and it's not divergent from the primary goals of this course.

!!! question

    Please provide the patch file for the changes you made to the kernel source code to create the new system call.

    - The patch file must be able to be applied to the v6.13 version of the kernel source code without any errors.
      If the patch file cannot be applied, you will receive zero marks for this question.
    - The patched kernel must be able to compile without any errors.
      If the patched kernel cannot compile, you will receive zero marks for this question.

!!! question

    Please provide the source code for your user-mode program in a C file.
    This program should take the PID of a process as input, invoke the new system call you created, and output the PIDs of all its children, one per line.
    Please ensure that the program compiles without error.
