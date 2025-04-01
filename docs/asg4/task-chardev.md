# Task 2: Character Device Driver and `ioctl`

In this task, you will implement a character device driver for the dummy EDU device.

Please read the following sections of [_The Linux Kernel Module Programming Guide_](https://sysprog21.github.io/lkmpg/):

- **Section 5.6** – Device Drivers
- **Section 6** – Character Device Drivers
- **Section 9** – Talking to Device Files

!!! note

    There is a mistake in the guide regarding the direction of `ioctl` operations:
    "Write" and "read" are from the user's point of view, just like the system calls `write` and `read`.

    - A `SET_FOO` ioctl should use `_IOW`, even though the kernel is reading data from user space.
    - A `GET_FOO` ioctl should use `_IOR`, even though the kernel is writing data to user space.

The material above explains how a userspace program may interact with a device driver, but it does not clearly show how the driver itself communicates with the PCI device hardware.

Similar to our previous task, the PCI device is identified using its **vendor ID** and **device ID**. The kernel’s PCI subsystem locates the device and invokes the `probe` callback function defined in the driver.

The `probe` function is responsible for initializing the device and setting up the driver to manage communication with it.
Once this setup is complete, the driver either enumerates the device’s resources or accesses known, pre-defined ones directly.

From that point on, the driver communicates with the hardware according to the device’s specification, typically through memory-mapped I/O or port I/O, allowing the system to use the device.

Please walk through the code provided in the `task2/edu-ioctl` directory, and complete the implementation of the `edu_ioctl` function.
Your implementation should handle the following `ioctl` commands:

- `IOCTL_EDU_IDENT`: Read the device identification register and return it to user space.
- `IOCTL_EDU_LIVECHECK`: Perform a liveness check (e.g., invert the given number and return the result).

!!! question

    Please finish the implementation of the `edu_ioctl` function in the file: `task2/edu-ioctl/edu.c`

You will also write a user-space program that interacts with the character device driver using `ioctl` to test the device driver.
The user-space program should accept two arguments:

1. The path to the character device file (e.g., `/dev/edu0`).
2. A 32-bit unsigned integer in hexadecimal format.

The program should output the device identification and the bitwise inversion of the given number using `ioctl`.
Here's the expected behavior of the program:

```console
$ sudo ./test-ioctl /dev/eduX 0x11111111
Identification: 0x010000edu
     Inversion: 0xeeeeeeee
```

!!! question

    Please write a C program that interacts with the character device driver using ioctl.
