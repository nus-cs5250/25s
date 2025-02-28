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

You will implement a new system call, `getcpid`, that provides a mechanism to obtain the PIDs of child processes for a given parent process.

In "cs5250.c", define the `getcpid` system call with the following signature:

```
ssize_t getcpid(pid_t pid, pid_t *cpid, uint32_t count);
```

The `getcpid` system call should take three arguments:

- `pid`: The process ID of the parent process whose child PIDs are to be retrieved.
- `cpid`: A pointer to a user-space array where the child PIDs will be stored.
- `count`: The size of the `cpid` array in number of elements.

When `cpid` is non-`NULL`, up to `count` child PIDs are stored in the array pointed to by `cpid`.
If cpid is `NULL`, the system call returns the total number of child processes without storing any PIDs.

**RETURN VALUE:**

- If cpid is `NULL`, the total number of child processes is returned.
- Otherwise:
  - On success, the number of child PIDs stored in the `cpid` array is returned.
  - On error, `-1` is returned, and `errno` is set appropriately.

**ERRORS:**

- `ESRCH`: No process with the specified PID exists.
- `EINVAL`: The `count` parameter is less than the number of child processes, or `cpid` is `NULL` and `count` is not zero.
- `EFAULT`: The `cpid` pointer points outside the accessible address space.

For guidance on how the system call should behave, you may look at the interface of [`getdents`](https://man7.org/linux/man-pages/man2/getdents.2.html).

!!! warning

    You **MUST** use `put_user`, `get_user`, `copy_to_user`, or `copy_from_user` to safely read from or write to user-space memory.
    Directly accessing user-space memory from the kernel is **NOT** allowed.

    Modern x86 processors implement Supervisor Mode Access Prevention (SMAP), a security feature that restricts the kernel from accessing user-space memory directly.
    Attempting such access without the appropriate functions will result in a fault.

    The functions `put_user`, `get_user`, `copy_to_user`, and `copy_from_user` help to handle user-space memory access safely.
    They temporarily disable SMAP protections during the memory access operation and restore them immediately afterward, ensuring both functionality and security are maintained.
    These functions also perform essential checks to ensure the safety and validity of memory access.

    See: <https://www.kernel.org/doc/html/v6.13/kernel-hacking/hacking.html#copy-to-user-copy-from-user-get-user-put-user>

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
