# Task 0: Cloud-Init

In this assignment, we'll use QEMU to emulate a non-existent peripheral device and develop a device driver for it.
But before diving into that, let's establish a production-level virtual machine using QEMU, transitioning away from a testing environment.

## Step 1: Boot Using a Cloud Image

In [Assignment 1](../asg1/task-boot.md), we used a RootFS archive to create a disk image, which didn’t include any boot components.
This time, we’ll boot from a **cloud image**, which is a full disk image that includes a bootable operating system.

Download the Ubuntu 24.04 cloud image <https://cloud-images.ubuntu.com/releases/24.04/release/ubuntu-24.04-server-cloudimg-amd64.img>.

We can directly boot from this image, but doing so would modify it, which we want to avoid.
In a real cloud environment, the same base image is used to spin up many virtual machines.
To keep it reusable, we avoid writing to it by creating a new disk image backed by the cloud image.
This keeps the base image untouched and stores all changes in a separate overlay file.

```bash
qemu-img create -f qcow2 -b ubuntu-24.04-server-cloudimg-amd64.img -F qcow2 cs5250-asg4.qcow2 16G
```

Then, you can boot the image using the following command:

```bash
qemu-system-x86_64 -nographic -smp 2 -m 2G cs5250-asg4.qcow2
```

Here, the `-smp` option specifies the number of virtual CPU cores, and the `-m` option specifies the amount of memory.
You can adjust these values based on the resources available on your machine.

## Step 2: Customize Your VM Using Cloud-Init

You might have tried logging into the VM but failed, because you don't know the credentials to log in.
This is similar to what we encountered in [Assignment 1](../asg1/task-boot.md), where the VM also didn't have a user created by default.
So before logging in, we need to create one.

Previously, we handled this by booting into single-user mode and manually adding a user.
While that works, it’s not scalable.
In real-world scenarios, especially in cloud environments, we need a more automated way to set up VMs.
Here we'll use **cloud-init**, a tool designed to automate the initial setup of cloud VMs.
It can create users, set passwords or SSH keys, install packages, and much more.
Let's follow the [documentation](https://cloudinit.readthedocs.io/).

Create a file named `user-data` with the following content:
(make sure to replace the username and password with your own)

```yaml
#cloud-config
hostname: cs5250-asg4
users:
  - name: ubuntu
    plain_text_passwd: password
    lock_passwd: false
    groups: users, admin
    sudo: ALL=(ALL) NOPASSWD:ALL
    shell: /bin/bash
ssh_pwauth: true
```

This file tells cloud-init what configuration to apply on first boot:

- Creates a user `ubuntu` with the password `password`
- Enables password-based SSH login
- Grants the user full `sudo` access

There are multiple ways for cloud-init to receive configuration data.
For simplicity, we’ll use a seed ISO image.

```bash
cloud-localds seed.img user-data
```

This creates an ISO image containing the configuration.
It acts like a virtual "cloud config drive".

Now boot the VM again, this time attaching the seed image as a CD-ROM:

```bash
qemu-system-x86_64 -nographic -smp 2 -m 2048 -nic user \
  -drive media=cdrom,format=raw,file=seed.img \
  -drive media=disk,format=qcow2,file=cs5250-asg4.qcow2
```

- `-nic user`: Provides basic user-mode networking
- `-drive media=cdrom`: Attaches the config ISO as a virtual CD
- `-drive media=disk`: Attaches the disk image

During boot, you’ll see logs from `cloud-init`.
Eventually, it should say:

```
Cloud-init ... finished at ...
```

Press **Enter** to get to the login prompt.
You can now log in using the username and password you configured earlier.

## Step 3: SSH into the VM

While the QEMU console works, it can be finicky.
For instance, there’s no line editing, so using backspace may behave weirdly.
It's not ideal for scripting or prolonged interaction.

To improve the workflow, you can forward the SSH port from the host to the VM.
Update your boot command like this:

```bash
qemu-system-x86_64 -nographic -smp 2 -m 2048 \
  -nic user,hostfwd=tcp::2222-:22 \
  -drive media=cdrom,format=raw,file=seed.img \
  -drive media=disk,format=qcow2,file=cs5250-asg4.qcow2
```

- `hostfwd=tcp::2222-:22` maps port 2222 on your host to port 22 (SSH) on the guest

Now you can SSH into the VM from the host:

```bash
ssh <username>@localhost -p 2222
```

You can change the port number `2222` to any other port number you prefer.
