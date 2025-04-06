# Task 3: Interrupt handler

!!! note

    You're to use the same environment as in the previous task.

The PCI device we're dealing with in this task can calculate the factorial of a number.
By properly setting the status register, it will raise an interrupt after finishing the computation.

In this task, we've provided you with framework code for the device driver.
Your job is to implement the interrupt handler and the service routines (open, close, read, and write) of the character device.

Here's the driver specification:

- (2 marks)
  The device file must be opened with either the `O_WRONLY` flag or the `O_RDONLY` flag, not both.
  If the flag is not properly set, the handler should return `-EINVAL`.
- (2 marks)
  The device file can only be opened at most once at any time.
  If the device file has already been opened when attempting to open it again, the handler should return `-EBUSY`.
- (4 marks)
  If the file is opened with the `O_WRONLY` flag, you can write a number to the device file.
  The device will start calculating the factorial of the number when you close the file.
- (4 marks)
  If the file is opened with the `O_RDONLY` flag, you can read the result of the factorial calculation.
- (2 marks)
  While the device is calculating the factorial, the device file cannot be opened until the computation is finished.
  If the device file is opened while the device is calculating the factorial, the handler should return `-EBUSY`.
- (4 marks)
  The driver must rely on the interrupt to be notified that the calculation is finished.
  Polling to check if the calculation is finished is not allowed.

Your driver must be free of memory errors.
Deadlock should not occur in the driver under any circumstances.

Here's the expected behavior of the device:

```console
$ sudo insmod edu.ko
$ echo 1 | sudo tee /dev/edu0
1
$ sudo cat /dev/edu0
fact(1) = 1
$ echo 5 | sudo tee /dev/edu0
5
$ sudo cat /dev/edu0
fact(5) = 120
$ echo x | sudo tee /dev/edu0
x
$ sudo cat /dev/edu0
fact(5) = 120
$ echo 12 > tmp.in
$ sudo dd if=tmp.in of=/dev/edu0 bs=1
3+0 records in
3+0 records out
3 bytes copied, 4.9727e-05 s, 60.3 kB/s
$ sudo dd if=/dev/edu0 of=tmp.out bs=1
21+0 records in
21+0 records out
21 bytes copied, 0.00015907 s, 132 kB/s
$ sudo cat tmp.out
fact(12) = 479001600
$ sudo rmmod edu
```

!!! question

    Please finish the implementation under the directory `task3-factorial/` in
    the repository.
