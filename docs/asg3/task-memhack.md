# Task 2: Memory Manipulation in Tetris Game

!!! note

    In this task, you'll be using the same `tetris` binary as in
    [Task 1](task-kprobe.md).

The game might not hold much appeal, but I'm eager to impress my friends with an incredibly high score.
Let's surprise them by modifying the score in the game.

The score is stored as a `int32_t` variable in memory.
We'll locate the address of the score and update it to a large number.

## Memory Regions

In order to modify the score, we need to find the address of the score in the `tetris` process.

The memory regions mapped to a process can be found in `/proc/[pid]/maps`.
For instance, to view the memory regions of the `bash` process:

```console
$ pgrep bash
769525
$ cat /proc/769525/maps
<output omitted here>
```

Please check the manual page of [`proc`](https://man7.org/linux/man-pages/man5/proc.5.html) for the meaning of the columns.

Run the `tetris` game and pause it.
Find its process ID using the `ps` or `pgrep` command.
Then, print the memory regions of the `tetris` process.

!!! question

    In which memory regions is it likely that the score is stored?

    1. Provide a complete copy of the output of `/proc/[pid]/maps` for the `tetris` process.
    2. List the memory regions that you believe are probable candidates for storing the score.
    3. Explain your rationale for why these memory regions are more likely to contain the score than others.

## Hack into the Memory Space

Merely identifying suspicious memory regions isn't sufficient.
We need to locate the exact address of the score in the `tetris` process.

To find the exact address of the score in the `tetris` process, we can play the game for a while, pause it, and then search through these regions for the score value.
If a 4-byte word in a memory region matches the score value, it's likely where the score is stored.
This involves digging into the `tetris` process's virtual memory to gather the necessary information.

Under procfs, there's a file `/proc/[pid]/mem` that allows you to read and write to the virtual memory of a process.
Please refer to the man page of [`proc`](https://man7.org/linux/man-pages/man5/proc.5.html) and read the section about `/proc/[pid]/mem`.
No need to worry about permission issues in this task.
You can use `sudo` to read and write to `/proc/[pid]/mem`.

A demo is provided in the "task2/demo" folder to help you understand how to hack into the virtual memory of a process via `/proc/[pid]/mem`.

<script async id="asciicast-viIoLKiGb0HKNsIlErYFtiYFC" src="https://asciinema.org/a/viIoLKiGb0HKNsIlErYFtiYFC.js"></script>

Please write a C++ program or a Python script to locate the address of the score in the `tetris` process.
The program should accept a single command-line argument, which is the process ID of the `tetris` process.

The program should first read the `maps` file of the `tetris` process to determine the potential memory ranges where the score might be stored.
Then, it should read the score value from stdin, and scan through the identified memory regions to locate the score value.
If it finds a memory location holding the score value, it should print out the address of that memory location.

It's possible that within these regions, there are multiple words containing the same value as the score.
To eliminate false positives, you can continue playing the game and pause it again to observe how these words change.
If you find memory locations that don't change as expected when the score updates, you can exclude them from consideration and finally find the actual address of the score.

## Change the Score

Now that you have determined the address of the score, you can proceed to modify it to a larger number.
Please update your program so that it can write a new score to the memory location of the score in the `tetris` process.

!!! warning

    Please note: any compilation errors, syntax errors, or runtime errors will result in a score of 0 for this task.

    You should probe the address of the score in your program interactively.
    It's not allowed to hardcode the address of the score in your program.
    A different victim program will be used to test your program, so the address will be different from the one in this tetris game.

!!! question

    Please submit the source code of the program written in either C++ or Python.
    Please remove the other source code file from the repository, and update the "manifest.json" file accordingly before submission.

## I'm So Scared!

In this task, we demonstrated how a root user can read and write to the virtual memory of a process running on the system, posing a security risk.
If you are using a shared system like the [SoC Compute Cluster](https://dochub.comp.nus.edu.sg/cf/services/compute-cluster), the system administrator might potentially access your process and extract sensitive runtime information as well.

!!! question

    Please discuss security concern with a LLM such as ChatGPT.
    Ask if there are any methods to prevent such unwanted actions.
    Evaluate the provided response for its effectiveness.
    If multiple solutions are suggested, choose only ONE of them to discuss.
