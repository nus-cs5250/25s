# Introduction

!!! info

    Please read the [general instructions](../index.md) first.

    The assignment is due **17:59 on 31 Mar 2025**.
    If the "Memory Management" lecture has not been completed by this date, the deadline will be extended to 17:59 on the following Monday after that lecture.
    Please refer to the due date set on Canvas for the most up-to-date deadline.
    No further announcements will be made regarding the extension if it occurs.

    Late submissions will lose **1 mark per hour**.

    If you discover any errors or need any clarification or have any question,
    please create an issue [here](https://github.com/nus-cs5250/25s/issues).

## Part A (35 marks)

!!! note

    In this assignment, we will look at how to hack a game of Tetris by hooking system calls and manipulating memory.

    Please accept the assignment on GitHub Classroom.
    The executable `tetris` is provided in the repository.
    You can verify the integrity of the provided `tetris` binary by checking its SHA-1 hash.
    ```
    $ sha1sum tetris
    69a36d6731f41330f38803e4f6b349c2bf5c4f42  tetris
    ```

    The executable is a statically linked AMD64 ELF binary.
    It should execute without any problems on your Ubuntu system.
    If there's any trouble executing the binary, please report [here](https://github.com/nus-cs5250/25s/issues).

### [Task 1: Hook System Calls with KProbes](task-kprobe.md)

**Question 1 (1 marks):**
What is the name of the system call that the game uses to keep track of time?

**Question 2 (2 marks):**
Give the complete command to run `strace` so that:

- The output is written to a file.
- Only the system call that the game uses to keep track of time is shown.
- It's fine if there are some other outputs not related to system calls, e.g., information about signals or exit status.

**Question 3 (5 marks):**
In the module, the first argument of the system call is accessed using `((struct pt_regs *)(regs->di))->di`.
Why do we need such an indirection to retrieve the arguments of the system call instead of directly accessing `regs->di`?
Please explain with a brief description of the call trace.

**Question 4 (2 marks):**
What is the problem with the address of the system call service routine?
How can you fix this problem and print the real address of the system call service routine?

**Question 5 (2 marks):**
Please fix this problem and print the real address of the system call service routine.
This should be a one-line change in the kernel module.

**Question 6 (2 marks):**
What is the GDB command to print the entry in the syscall table for the system call you identified in Question 1?

**Question 7 (6 marks):**
Please modify the provided kernel module to delay the movement of the bricks in the `tetris` game by 1 second.

### [Task 2: Memory Manipulation in Tetris Game](task-memhack.md)

**Question 8 (5 marks):**
In which memory regions is it likely that the score is stored?

1. Provide a complete copy of the output of `/proc/[pid]/maps` for the `tetris` process.
2. List the memory regions that you believe are probable candidates for storing the score.
3. Explain your rationale for why these memory regions are more likely to contain the score than others.

**Question 9 (6 marks):**
Please submit the source code of the program written in either C++ or Python.

**Question 10 (4 marks):**
Please discuss security concern with a LLM such as ChatGPT.
Ask if there are any methods to prevent such unwanted actions.
Evaluate the provided response for its effectiveness.
If multiple solutions are suggested, choose ONLY one of them to discuss.

### Submission Guidelines

Please accept the assignment on GitHub Classroom first.
The invitation link is available on [Canvas](https://canvas.nus.edu.sg/courses/70149/assignments/173562).
Then, proceed to complete the tasks and push your work to GitHub accordingly.

Refer to the submission guidelines in [Assignment 1](../asg1/index.md#submission-guidelines) for the remaining instructions.

**For this assignment:**

1. Questions 1, 2 and 6 shall be answered in the `manifest.json` file directly.
2. Question 9 can be answered either in C++ or Python. Please update the entry in `manifest.json` accordingly.

## Part B (15 marks)

Please complete the quiz [Assignment 3 (Part B)](https://canvas.nus.edu.sg/courses/70149/assignments/171201) on Canvas.
