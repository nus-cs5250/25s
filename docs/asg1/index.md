# Introduction

!!! info

      Please read the [general instructions](../index.md) first.

      Part A of the assignment is due **17:59 on 17 Feb 2025**.
      Part B of the assignment is due **17:59 on 10 Feb 2025**.
      Late submissions will lose **1 mark per hour**.

!!! info

      These assignments are designed under the assumption that you are using an x86-64 machine.
      If you do not have access to a machine based on the x86 architecture, you have the option to request a server for your use.
      To proceed with a server request, please complete and submit
      [this form](https://canvas.nus.edu.sg/courses/70149/quizzes/56106).
      However, in order to ensure the efficient use of resources, we kindly ask that you request a server only if there are no other viable alternatives.

## Part A (35 marks)

### [Task 1: Setup a Virtual Machine](task-vm.md)

**Question 1 (2 marks):**

What is the IP address allocated to your VM?
Please take a screenshot of the command and its output that shows the IP address.

Please adjust the terminal width to 80-120 characters when you take the screenshot, so that the screenshot is easily readable.

**Question 2 (3 marks):**

Different CPUs may have different features even if they are based on the same architecture.
[SMAP](https://en.wikipedia.org/wiki/Supervisor_Mode_Access_Prevention) is one of the features commonly available in modern CPUs, but it may not be properly virtualized in some virtual machines.
Is SMAP available in the VM you have created?
Please write a shell script to check if SMAP is available in the VM.

Hint:
The `xlogin` nodes in the [SoC Compute Cluster](https://dochub.comp.nus.edu.sg/cf/guides/compute-cluster/start) should have SMAP available.
You can use it as a reference.

**Question 3 (3 marks):**

Whenever you log in to the VM, either locally through the console or remotely via SSH, the system authenticates you using your password or SSH key.
These login activities are recorded in the system log file located at `/var/log/auth.log`.
Locate the log entries that record your successful login to the system **via SSH**, take a screenshot of the relevant section of the log, and highlight on the screenshot:

- Which part of the log indicates the login activity occurred via SSH.
- Is the accepted authentication method, whether it was a password or an SSH key.

Please adjust the terminal width to 80-120 characters when you take the screenshot, so that the screenshot is easily readable.

**Question 4 (2 marks):**

It’s common to need to check how much storage is available in your VM, and this can be done by running the `df` command.
Please refer to the man page of `df` by executing `man df` and learn how to

- output the available storage in a human-readable format, as well as
- the type of the filesystems.

Take a screenshot of the command and its output showing the available storage in a human-readable format, along with the type of filesystems. Highlight the line that represents the shared folder.

Please adjust the terminal width to 80-120 characters when you take the screenshot, so that the screenshot is easily readable.

### [Task 2: Build and Install Linux Kernel](task-kbuild.md)

**Question 5 (10 marks):**
Please submit the DEB package `linux-image-6.13.0*_6.13.0-*_amd64.deb` containing your customized smaller kernel.

### [Task 3: Explore the Boot Process](task-boot.md)

**Question 6 (4 marks):**
Please submit the patch file that modifies the SeaBIOS source code to print your Matric No. below the SeaBIOS version.

Please note:

- You won't get any marks if the patch cannot be applied to a clean copy of SeaBIOS source code.
- You won't get any marks if it fails to build after applying your patch.

**Question 7 (3 marks):**
Please submit the source code of the C program `dispatch.c` that behaves differently depending on the name of the executable.

**Question 8 (6 marks):**
Please submit the initramfs image `initramfs.cpio.gz` which can switch to the root filesystem.

**Question 9 (2 marks):**
Which component acts upon the `systemd.unit=rescue.target` argument?
Is it consumed by the (a) BIOS, (b) kernel, (c) initramfs, or (d) after switching to the root filesystem?

Please choose ONE of the options above first and then provide a brief explanation.

### Submission Guidelines

Please accept the assignment on GitHub Classroom first.
The invitation link is available on [Canvas](https://canvas.nus.edu.sg/courses/70149/assignments/166038).
Then, proceed to complete the tasks and push your work to GitHub accordingly.

**For all of the following assignments** (we will not repeat this every time):

1. The deadline posted on GitHub is the hard deadline — you'll lose write access to the repository after that time.
   Late penalties will apply starting from the due date on Canvas.

1. Please **"Create a new release"** on GitHub when you're done with your job.
   You can create multiple releases, but only the latest release[^latest] will be graded.
   Your submission time (used for calculating late penalties) is based on the time of the release on GitHub.

1. Only push essential files to the repository.
   Do not include binaries, object files, or any other files generated from your source code (except explicitly required) in the repository.
   Make sure to properly use the `.gitignore` file to exclude inappropriate files from being pushed to the repository.
   If your repository is messy or contains any unnecessary files, there will be a one-time penalty of 2 marks.

1. In the root directory of the repository, there's a file named `manifest.json` which contains paths to the files submitted for each question.
   We will use this file to determine which files to grade.
   You SHOULD update this file with the correct paths to your files.

1. There's a script `.github/ci.py` in the repository that checks if the repository contains essential files for each question.
   The script will be executed automatically when you create a release on GitHub.
   You can also use the script locally for your own checking.

1. Ensure that your patch can be applied and your code can be compiled.
   Otherwise, you will lose all of the marks for the question.

**For this assignment:**

1. For Qn5, the DEB package should be uploaded on [Canvas](https://canvas.nus.edu.sg/courses/70149/assignments/166038) and a checksum of the DEB package should be provided in the Git repository.
   You can create the checksum using the script `task2/generate_checksum` in the repository.

   - **Plase Do NOT commit / push the DEB package to this repository.**
     It's a common practice to exclude large binary files from git repositories.
   - Make sure the the correct checksum of the DEB package is provided.
     If the checksum is incorrect, the late penalty will be applied based on the time you submit the DEB package on Canvas or the time you you create the release on GitHub, whichever is later.

1. For this assignment, you are required to answer Questions 9 in Markdown format.
   If you're unfamiliar with Markdown syntax, you can find numerous online tutorials, such as the one available at [CommonMark](https://commonmark.org/help/tutorial/).

[^latest]: The latest release is the one presented at https://github.com/OWNER/REPO/releases/latest.

## Part B (15 marks)

Please complete the quiz [Assignment 1 (Part B)](https://canvas.nus.edu.sg/courses/70149/quizzes/56514) on Canvas.
