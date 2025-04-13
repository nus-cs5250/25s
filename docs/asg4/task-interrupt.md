# Task 3: Interrupt handler

!!! note

    You're to use the same environment as in the previous task.

The PCI device we're dealing with in this task can calculate the factorial of a number.
When the computation completes, the device raises an interrupt if the status register is set correctly.

In this task, we've provided you with framework code for the device driver.
Your job is to implement the interrupt handler and the service routines (open, close, read, and write) of the character device.

Here's the specification:

- (2 marks)
  The device file must only be opened with either `O_WRONLY` or `O_RDONLY`.
  Opening with both or other flags should return `-EINVAL`.
- (2 marks)
  The device file can only be opened at most once at any time.
  If the device file is already opened, the handler should return `-EBUSY` when another open attempt is made.
- (3 marks)
  If the file is opened with the `O_WRONLY` flag, you can then write a number to the device file.
  The correctness of the write function is checked based on whether the "edu" device receives the expected input when the file is closed.
- (3 marks)
  If the file is opened with the `O_RDONLY` flag, you can then read the result of the factorial calculation.
  The correctness of the read function is checked by strict string matching between the output of the read function and the expected output described in the example below.
- (2 marks)
  The "edu" device shall start calculating the factorial when the file is closed, provided it was opened with the `O_WRONLY` flag and a number was written to it.
- (2 marks)
  While the device is calculating the factorial, the device file cannot be opened until the computation is finished.
  If the device file is opened while the device is calculating the factorial, the handler should return `-EBUSY`.
- (4 marks)
  The driver must rely on the interrupt to be notified that the calculation is finished.
  Polling to check if the calculation is finished is not allowed.

Your driver must be free of memory errors.
Deadlock should not occur in the driver under any circumstances.

The following examples illustrate the expected behavior of the device.
These examples are for demonstration only; we will use different input values for grading.

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

    Please finish the implementation under the directory `task3/edu-irq/` in the repository.
