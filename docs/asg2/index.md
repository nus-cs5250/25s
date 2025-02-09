# Introduction

!!! info

    Please read the [general instructions](../index.md) first.

    The assignment is due **17:59 on 3 Mar 2025**.
    Late submissions will lose **1 mark per hour**.

## Part A (35 marks)

!!! info

    The invitation link is available on Canvas.
    Some code snippets are provided for you in the repository.
    The invitation link is available on [Canvas](https://canvas.nus.edu.sg/courses/70149/assignments/169631).

!!! info

    Throughout this assignment, you will be working with the Linux kernel version 6.13.
    Please start with the default configuration and make the following two features enabled:

    - Kernel hacking
      - Compile-time checks and compiler options
        - Debug information
          - **Rely on the toolchain's implicit default DWARF version (`DEBUG_INFO_DWARF_TOOLCHAIN_DEFAULT [=y]`)**
        - **Provide GDB scripts for kernel debugging (`GDB_SCRIPTS [=y]`)**

    If you need VirtualBox shared folders, ensure that `CONFIG_VBOXGUEST` and `CONFIG_VBOXSF_FS` are enabled in your kernel configuration.

### [Optional: Get Around in the Source Code Tree](task-browsing.md)

### [Task 1: Debugging with GDB](task-gdb.md)

**Question 1 (2 marks):**
Which figure in the ABI documentation describes the stack layout for the initial state of a process?

**Question 2 (2 marks):**
Which interrupt line (IRQ) is allocated for this specific interrupt?

**Question 3 (4 marks):**
How does the `/init` program get executed?
Is this procedure similar to how `execve` works?
Does a context switch occur, similar to what happens during a `syscall`?
Please explain your observation briefly.

### [Task 2: Developing a Kernel Module](task-module.md)

**Question 4 (2 marks):**
Identify the file and line number where the `module_init` macro is defined **for our scenario**.

Please give your answer in the format `file#L1234`.
For example, if it were defined in
[kernel/sched/core.c](https://elixir.bootlin.com/linux/v6.13/source/kernel/sched/core.c#L6636)
at line 6636, you should refer to it as `kernel/sched/core.c#L6636`.

**Question 5 (2 marks):**
Why is `printk` used instead of `printf` within kernel modules?

**Question 6 (2 marks):**
Did you observe the output "Greetings from xxx" when you loaded the module?
If not, is this string compiled into the module?
Please explain your observation briefly.

**Question 7 (2 marks):**
Modify the Makefile, if necessary, to make the message compiled into the module.

**Question 8 (4 marks):**
Submit the source code for your kernel module.
The module shall accept two parameters and output the process ID and executable name for the given PID.
Ensure that the module compiles without errors using the Makefile and that it can be loaded and unloaded without any error.

**Question 9 (3 marks):**
Submit the Makefile that builds and loads the kernel module.
The Makefile should include **two additional** targets beyond those in the previously provided Makefile.

1. `insmod` loads the module with the appropriate arguments.
   The command that uses this target should be:
   ```
   $ sudo make insmod tag=xxx pid=yyy
   ```
2. `rmmod` unloads the module.
   The command that uses this target should be:
   ```
   $ sudo make rmmod
   ```

### [Task 3: Creating a New System Call](task-syscall.md)

**Question 10 (8 marks):**
Please provide the patch file for the changes you made to the kernel source code to create the new system call.
The patch file should have suffix `.patch` and adhere to the following requirements:

- The patch file must be able to be applied to the v6.13 version of the kernel source code without any errors.
  If the patch file cannot be applied, you will receive zero marks for this question.
- The patched kernel must be able to compile without any errors.
  If the patched kernel cannot compile, you will receive zero marks for this question.

**Question 11 (4 marks):**
Please provide the source code for your user-mode program in a C file.
This program should take the PID of a process as input, invoke the new system call you created, and output the PIDs of all its children, one per line.
Please ensure that the program compiles without error.

### Submission Guidelines

Please accept the assignment on GitHub Classroom first.
The invitation link is available on [Canvas](https://canvas.nus.edu.sg/courses/70149/assignments/169631).
Then, proceed to complete the tasks and push your work to GitHub accordingly.

## Part B (15 marks)

Please complete the quiz [Assignment 2 (Part B)](https://canvas.nus.edu.sg/courses/70149/quizzes/57317) on Canvas.
