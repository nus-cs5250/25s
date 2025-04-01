# Task 1: PCI Device

A PCI (Peripheral Component Interconnect) device is a type of hardware device that connects to a computer's motherboard using the PCI interface.
PCI devices can be internal or external and are used for a wide range of applications, such as graphics and audio processing, networking, and storage.
The PCI bus is a high-speed data path that allows the CPU to communicate with the device and provides a common interface for a variety of hardware devices.
PCI devices are identified by a unique vendor ID and device ID and require a specific driver to communicate with the operating system.
They can be added or removed while the computer is running, making them a convenient and flexible option for expanding a system's capabilities.

In this task, you will be emulating a PCI device using QEMU and interacting with it.
The first step in this process is to set up the QEMU environment.

### Launch a VM on QEMU

Continuing from the steps outlined in [Task 0](task-cloudinit.md), add an additional flag to the QEMU command to emulate the PCI EDU device.

```
  -device edu
```

You can add more copies of the `-device edu` flag to create multiple instances of the PCI device.

### Explore the PCI device

Use the `lspci` command to discover the PCI slot name of the device with a vendor ID of **0x1234** and a device ID of **0x11e8**.
Refer to the man page of the `lspci` command for additional information if needed.

!!! question

    Take a screenshot of the `lspci` command and its output that shows the name of the slot where the device resides.
    Highlight the entry relevant to the EDU device device you are emulating.

    Please adjust the terminal width to 80-120 characters when you take the screenshot, so that the screenshot is easily readable.

Linux provides a mechanism to access PCI device resources through the sysfs.
You can read the kernel documentation on [Accessing PCI device resources through sysfs](https://www.kernel.org/doc/html/v6.13/PCI/sysfs-pci.html).

You can use the `hexdump` command or the `xxd` command to read the content of the PCI device's configuration space.
Refer to the specification of the PCI configuration space, available [here](https://en.wikipedia.org/wiki/PCI_configuration_space), to make sense of the output.

The file `resource0` in the directory represents the resource described by the 1st base address register (BAR) (at offset 0x10) in the PCI configuration space.
It's specification is available at the "MMIO area spec" section of the [QEMU documentation](https://www.qemu.org/docs/master/specs/edu.html#mmio-area-spec).
You may find the source code of the device [here](https://github.com/qemu/qemu/blob/v8.2.2/hw/misc/edu.c) as well.

According to the specification, the reading the first four bytes of the file `resource0` should yield the value `0x010000ed`.
However, when attempting to read the first four bytes of the file using the `head -c 4 resource0` command, an "Input/output error" is encountered:

```bash
$ sudo head -c 4 resource0
head: error reading 'resource0': Input/output error
```

The relevant system calls are as follows:

```
openat(AT_FDCWD, "resource0", O_RDONLY) = 3
read(3, 0x7fffdaf2f780, 4)              = -1 EIO (Input/output error)
```

!!! question

    Why can't we read from the file `resource0`?

    Hint:

    - According to the [documentation](https://www.kernel.org/doc/html/v6.13/PCI/sysfs-pci.html), `rw` access is allowed for `IORESOURCE_IO` regions only.
    - Refer to the information available from the configuration space.

### Access the PCI device

Since the file is mmapable, we can use the `mmap` system call to map the file into the process's address space and then access the device's registers.
For more information about the `mmap` system call, you can refer to the [man page](https://www.man7.org/linux/man-pages/man2/mmap.2.html).

Please write a program that accepts two arguments:

1. The path to the PCI device's "resource0".
2. A 32-bit unsigned integer in hexadecimal format.

The program should successfully output the identification of the device and the inversion of the given number.

Here's the expected behavior of the program:

```console
$ sudo ./pci-mmap /sys/path/to/the/device/resource0 0x11111111
Identification: 0x010000edu
     Inversion: 0xeeeeeeee
```

!!! tip

    You should be able to accomplish the task by only inserting some lines in the given slot.
    However, feel free to modify other parts of the code if needed.

!!! question

    Please write a C program that operates the `resource0` of the PCI device by mapping it into the process's address space.
