# Task 2: Developing a Kernel Module

A kernel module is a program that can be dynamically loaded and unloaded into the kernel on demand.
This allows for the extension of kernel functionality without requiring the rebuilding of the kernel or system reboot.

Numerous functionalities in the Linux kernel are implemented as modules.
For instance, device drivers are commonly developed as modules.
This modular approach enables the kernel to load only the necessary modules based on the hardware present in the system,
effectively maintaining a compact kernel.

In this task, we will explore some basic concepts of kernel module development and play with some essential APIs for kernel development.

## Say Hello from the Kernel

Create a directory for your "Hello World" module.

In the directory, create a file named "hello.c" with the following code to implement the "Hello World" module.

```c
#include <linux/init.h>
#include <linux/module.h>
#include <linux/printk.h>

MODULE_LICENSE("GPL");
MODULE_AUTHOR("cs5250"); // Replace with your
MODULE_DESCRIPTION("A sample kernel module");

static int __init hello_init(void)
{
    printk(KERN_NOTICE "Hello World!\n");
    pr_info("Hello, world!\n");
    pr_debug("Greetings from %s.\n", THIS_MODULE->name);

    return 0;
}

static void __exit hello_exit(void)
{
    pr_info("Goodbye world.\n");
}

module_init(hello_init);
module_exit(hello_exit);
```

Kernel modules must include at least two functions:
an initialization function that is called when the module is loaded into the kernel and
a cleanup function that is invoked just before the module is removed from the kernel.
These functions are registered using the `module_init` and `module_exit` macros.
Please locate the accurate definition (as used here) of the two macros within the kernel source code.

!!! warning

    Make sure that you refer to the v6.13 version of the kernel source code.

!!! question

    Identify the file and line number where the `module_init` macro is defined **for our scenario**.

    Please give your answer in the format `file#L1234`.
    For example, if it were defined in
    [kernel/sched/core.c](https://elixir.bootlin.com/linux/v6.13/source/kernel/sched/core.c#L6636)
    at line 6636, you should refer to it as `kernel/sched/core.c#L6636`.

Upon loading the module, the `hello_init` function is executed, and within it, we print messages using `printk`.
Typically, these messages include a priority level like `KERN_NOTICE`, `KERN_INFO` or `KERN_DEBUG`.
In modern conventions, it is recommended to use print macros such as `pr_info` and `pr_debug` as alternatives to directly employing `printk`.
These macros wrap around `printk`, keeping things the same while making code simpler and look nicer by cutting down on repetitive typing.

!!! question

    Why is `printk` used instead of `printf` within kernel modules?

To build the module, you need a Makefile.
Please create a file named "Makefile" in the same directory as "hello.c" with the following content.

```Makefile
obj-m += hello.o

all:
	make -C /lib/modules/$(shell uname -r)/build M=$(PWD) modules

clean:
	make -C /lib/modules/$(shell uname -r)/build M=$(PWD) clean
```

Then run `make` to build the module. You should see a new file named "hello.ko" in the directory.

To load the module, use the `insmod hello.ko` command.
After loading the module, you can check the kernel log using the `dmesg` command to see the "Hello World" message.
Then you can unload the module using the `rmmod hello` command.

!!! question

    Did you observe the output "Greetings from xxx" when you loaded the module?
    If not, is this string compiled into the module?
    Provide a brief explanation of how to make the message at the "DEBUG" level appear in the kernel log.

    Hint: You might find the `strings` command helpful.

## Passing Arguments to a Module

You can pass arguments to a module during its loading process by utilizing the `module_param` macro for declaring module parameters.
Please search for further details on the usage of `module_param`, and modify the provided program below to declare two module parameters:

- A string parameter named "`tag`" with a default value corresponding to your Matriculation Number.
- An integer parameter named "`pid`" with a default value of 1.

```c
#include <linux/init.h>
#include <linux/module.h>
#include <linux/printk.h>
#include <linux/sched.h>

MODULE_LICENSE("GPL");
MODULE_AUTHOR("cs5250");
MODULE_DESCRIPTION("A sample kernel module");

/* MODIFY THE CODE BELOW TO declare module parameters */
const char *tag = "A01234567A";
pid_t pid       = 1;
/* MODIFY THE CODE ABOVE TO declare module parameters */

static int __init getcomm_init(void)
{
    pr_debug("This is %s speaking.\n", tag);

    struct task_struct *task = get_pid_task(find_vpid(pid), PIDTYPE_PID);
    pr_info("%s: [%d] %s\n", tag, task->pid, task->comm);

    pr_debug("Goodbye from %s.\n", tag);
    return 0;
}

static void __exit getcomm_exit(void)
{
    pr_info("Goodbye world.\n");
}

module_init(getcomm_init);
module_exit(getcomm_exit);
```

Build the module and load it using the `insmod` command.
You should observe an output in the kernel log similar to the following:

```text
A01234567A: [1] systemd
```

Provide the `insmod` command with appropriate arguments to set the "tag" to `cs5250` and the "pid" to the PID of any valid process.
The module should then print the tag, PID, and the executable name of the process in a similar format.

!!! question

    Submit the source code for your kernel module.
    The module shall accept two parameters and output the process ID and executable name for the given PID.
    Ensure that the module compiles without errors using the Makefile and that it can be loaded and unloaded without any error.

!!! question

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
