# Introduction

!!! info

    Please read the [general instructions](../index.md) first.

    The assignment is due **17:59 on 21 Apr 2025**.
    Late submissions will lose **1 mark per hour**.

    If you discover any errors or need any clarification or have any question,
    please create an issue [here](https://github.com/nus-cs5250/25s/issues).

## Part A (35 marks)

!!! note

    Please accept the assignment on GitHub Classroom first.
    The invitation link is available on
    [Canvas](https://canvas.nus.edu.sg/courses/70149/assignments/178206).

### [Task 0: Cloud-Init](task-cloudinit.md)

### [Task 1: PCI Device](task-pcidev.md)

**Question 1 (2 marks)**

Take a screenshot of the `lspci` command and its output that shows the name of the slot where the device resides.
Highlight the entry relevant to the EDU device device you are emulating.

Please adjust the terminal width to 80-120 characters when you take the screenshot, so that the screenshot is easily readable.

**Question 2 (4 marks)**

Why can't we read from the file `resource0`?

**Question 3 (5 marks)**

Please write a C program that operates the `resource0` of the PCI device by mapping it into the process's address space.

### [Task 2: Character Device Driver and `ioctl`](task-chardev.md)

**Question 4 (4 marks)**

Please finish the implementation of the `edu_ioctl` function in the file: `task2/edu-ioctl/edu.c`

**Question 5 (2 marks)**

Please write a C program that interacts with the character device driver using ioctl.

### [Task 3: Interrupt handler](task-interrupt.md)

**Question 6 (18 marks)**

Please finish the implementation under the directory `task3/edu-irq/` in the repository.

### Submission Guidelines

Please accept the assignment on GitHub Classroom first.
The invitation link is available on [Canvas](https://canvas.nus.edu.sg/courses/70149/assignments/178206).
Then, proceed to complete the tasks and push your work to GitHub accordingly.

Refer to the submission guidelines in [Assignment 1](../asg1/index.md#submission-guidelines) for the remaining instructions.

## Part B (15 marks)

Please complete the quiz [Assignment 4 (Part B)](https://canvas.nus.edu.sg/courses/70149/quizzes/58265) on Canvas.
