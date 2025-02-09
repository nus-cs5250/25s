# Task 1: Setup a Virtual Machine

It is common to have problems during the setup stage.
Try to figure it out yourself first.
Remember to read the error messages carefully and search online for solutions.
The abilities to search and debug is crucial in dealing with Linux.

However, if you cannot find solutions after you try all approaches you can think of, feel free to discuss it with your classmates or email the TA.

!!! warning "Not using an x86 machine?"

    These assignments are designed with the assumption that you're using an x86-64 machine.
    If you don't have access to an x86-based machine, you should have already requested a server for your assignments.

    Please note that you won't have access to the graphical interface of the remote machine, so additional steps may be required.
    Refer to the relevant tabs for instructions tailored to your situation.

    === "Local Machine"

        These instructions are for students who are using their own x86 machines.

    === "Remote Server"

        These instructions are for students who are using the remote server provided by the course.

## Install VirtualBox on your machine

=== "Local Machine"

    VirtualBox is an open-source software that runs on most common platforms.
    Please download the latest version from [page](https://www.virtualbox.org/wiki/Downloads) and install it on your machine.
    It should work on all major x86-based platforms.

=== "Remote Server"

    **You'll still be working with VirtualBox.**

    For some parts of the assignment, you will need to operate the machine even before the operating system is fully booted.
    Therefore, it is necessary to work in a virtual machine under your full control, even though the server is already pre-installed with Ubuntu.

    The server we provide already has VirtualBox and the extension pack installed.
    You can use the following command to check the version of VirtualBox:

    ``` console
    $ VBoxManage --version
    7.0.16_Ubuntur162802
    ```

## Download an ISO image of Linux Ubuntu

You can download the Ubuntu Server 24.04.1 LTS install image for a 64-bit machine from [here](https://download.nus.edu.sg/mirror/ubuntu-releases/24.04/ubuntu-24.04.1-live-server-amd64.iso) or from [Ubuntu's official website](https://ubuntu.com/download/server).

## Create and launch a virtual machine

=== "Local Machine"

    1. Start VirtualBox
    1. Click "New" button in the Oracle VM VirtualBox Manager.
    1. Use the setting listed below
      - Name and the Operating System
        - Name: CS5250 (or anything you like)
        - ISO Image: Choose the ISO file you downloaded
        - Check "Skip Unattended Installation"
      - Hardware
        - Base Memory: 2048 MB (or larger, you can change this when needed)
        - Processors: 2 (or more, you can change this when needed)
      - Hard Disk
        - Create a virtual hard disk now.
        - Allocate at least 40 GB
    1. Click "Finish"

    Start your virtual machine by clicking "Start" in VirtualBox Manager.

=== "Remote Server"

    You will use the `VBoxManage` command to create and manage your virtual machine.
    After that, you can then connect to it from your local machine via the Remote Desktop Protocol.

    For an overview of how to create a VM on a headless server, refer to [Section 7.1.3](https://www.virtualbox.org/manual/ch07.html#headless-vm-steps).
    Keep the following points in mind:

    - The example provided in the manual is for Windows XP, but we intend to use Linux as the Guest OS.
      Adjust the `ostype` accordingly to match your requirements.
      You may find the list of supported OS types using `VBoxManage list` command [(see here)](https://www.virtualbox.org/manual/ch08.html#vboxmanage-list).
    - When configuring your VM, choose an appropriate number of CPUs, memory size, and virtual hard disk size.
      We recommend setting it to 2 CPUs, 2 GB of memory, and 40 GB of disk space.

    Here’s a sample script to create and configure a VM.
    Use it with caution and adjust it according to your requirements.
    **Copying and pasting the script without reviewing it is highly discouraged.**

    ```bash
    # Create a virtual machine
    VBoxManage createvm --name <VM-name> --ostype "Ubuntu_64" --register

    # Configure virtual hardware resources
    VBoxManage modifyvm <VM-name> --cpus 2 --memory 2048

    # Create a virtual hard disk (40GiB)
    pushd "$HOME/VirtualBox VMs/<VM-name>"
    VBoxManage createmedium disk --filename "<VM-name>.vmdk" --size 40960 --format VMDK
    VBoxManage storagectl <VM-name> --name "SATA Controller" --add sata --controller IntelAHCI
    VBoxManage storageattach <VM-name> --storagectl "SATA Controller" --port 0 --device 0 --type hdd --medium "<VM-name>.vmdk"
    popd

    # Create a virtual DVD drive with installation ISO
    VBoxManage storagectl <VM-name> --name "IDE Controller" --add ide
    VBoxManage storageattach <VM-name> --storagectl "IDE Controller" --port 0 --device 0 --type dvddrive --medium /path/to/ubuntu-24.04.1-live-server-amd64.iso

    # Enable VRDP
    VBoxManage modifyvm <VM-name> --vrde on
    ```

    You may use the following command to check the configuration of your VM:

    ```bash
    $ VBoxManage showvminfo cs5250
    ```

    A RDP client is needed to connect to the VM.
    For Mac users, you can install "Windows App" from the App Store.

    The VRDP server that comes with VirtualBox typically uses TCP port 3389 by default.
    However, for security reasons, this port is disabled using [ufw](https://ubuntu.com/server/docs/security-firewall) on the server.
    You should use SSH port forwarding to map the VRDP port to your local machine by executing the following command on your local machine:

    ```bash
    ssh -L 3389:localhost:3389 <username>@<server-ip>
    ```

    This command establishes a secure SSH tunnel, forwarding traffic from port 3389 on your local machine to port 3389 on the server, facilitating secure access to the VRDP server on the remote machine as if it were running locally.

    Then you can start the virtual machine by executing the following command on the server:

    ```console
    $ VBoxHeadless --startvm <VM-name>
    Oracle VM VirtualBox Headless Interface 7.0.16_Ubuntu
    Copyright (C) 2008-2024 Oracle and/or its affiliates

    Starting virtual machine: VRDE server is listening on port 3389.
    10%...20%...30%...40%...50%...60%...70%...80%...90%...100%
    ```

    Once initiated, connect to the virtual machine using your RDP client.
    Since the port has been forwarded to your local machine, set the "PC name" as either `localhost` or `127.0.0.1`.
    If you are required to enter a username and password, use the username you used to SSH into the server and the password you set.

    !!! info "Remove VNC Extension Pack"

        When installing the VirtualBox Extension Pack, a VNC extension pack may be installed by default.
        This extension pack may cause conflicts with the VRDP server.
        If you have trouble connecting to the VRDP server, you may try uninstalling the VNC extension pack.

        You may check if the VNC extension pack is installed using the following command:

        ```
        $ VBoxManage list extpacks
        Extension Packs: 2
        Pack no. 0:   VNC
        Version:        7.0.16
        Revision:       162802
        Edition:
        Description:    VNC plugin module
        VRDE Module:    VBoxVNC
        Crypto Module:
        Usable:         true
        Why unusable:

        Pack no. 1:   Oracle VM VirtualBox Extension Pack
        Version:        7.0.16
        Revision:       162802
        Edition:
        Description:    Oracle Cloud Infrastructure integration, Host Webcam, VirtualBox RDP, PXE ROM, Disk Encryption, NVMe, full VM encryption.
        VRDE Module:    VBoxVRDP
        Crypto Module:  VBoxPuelCrypto
        Usable:         true
        Why unusable:
        ```

        If the VNC extension pack is installed, you can uninstall it using the following command:

        ```
        $ sudo VBoxManage extpack uninstall VNC
        [sudo] password for sadm:
        0%...10%...20%...30%...40%...50%...60%...70%...80%...90%...100%
        Successfully uninstalled "VNC".
        ```

## Install OS for your VM

Follow the guided installation process to install Ubuntu on your virtual machine.
Please take note of the following settings:

- **Keyboard configuration**:
  If you are using a Mac keyboard, the layout may be different from the standard ANSI or ISO ones.
  You may try a "Keyboard Variant" ending with `(Macintosh)`.
- **Guided storage configuration**:
  Please uncheck the "Set up this disk as an LVM group" option.
- **Profile configuration**:
  - **Name**: Enter your full name.
  - **Server's Name**: Choose a name that starts with your NUSNET ID.
  - **Username**: Choose a username that is formed from your real name.
  - **Password**: Choose a secure password.
- **SSH configuration**:
  - Ensure to check the "Install OpenSSH server" option.

After reboot, you shall see some logs doing initial setup, which is output by "cloud-init".
When it is done, press "Enter" and you should see the login prompt.

```
<hostname> login:
```

To login, input your username, press "Enter", and then input your password[^pwd] as required.
And you will see the bash prompt.

```
user@<hostname>:~$
```

As a beginner, you may try to find and print the information below.

- The OS version and the kernel release version
- The IP address allocated, and your MAC address

!!! question

    What is the IP address allocated to your VM?
    Please take a screenshot of the command and its output that shows the IP address.

    Please adjust the terminal width to 80-120 characters when you take the screenshot, so that the screenshot is easily readable.

!!! question

    Different CPUs may have different features even if they are based on the same architecture.
    [SMAP](https://en.wikipedia.org/wiki/Supervisor_Mode_Access_Prevention) is one of the features commonly available in modern CPUs, but it may not be properly virtualized in some virtual machines.
    Is SMAP available in the VM you have created?
    Please write a shell script to check if SMAP is available in the VM.

    Hint:
    The `xlogin` nodes in the [SoC Compute Cluster](https://dochub.comp.nus.edu.sg/cf/guides/compute-cluster/start) should have SMAP available.
    You can use it as a reference.

## Setting up SSH connection

Configure the virtual machine to allow connection via SSH from the host[^host] machine.
Once the SSH connection is set up, you can access the VM from your host machine using a terminal or an SSH client.
You can even attach VSCode to the VM for a better experience.

To achieve this, you will need to modify the network settings of the VM and configure port forwarding to make the VM’s SSH port accessible from the host machine.

!!! question

    Whenever you log in to the VM, either locally through the console or remotely via SSH, the system authenticates you using your password or SSH key.
    These login activities are recorded in the system log file located at `/var/log/auth.log`.
    Locate the log entries that record your successful login to the system **via SSH**, take a screenshot of the relevant section of the log, and highlight on the screenshot:

    - Which part of the log indicates the login activity occurred via SSH.
    - Is the accepted authentication method, whether it was a password or an SSH key.

    Please adjust the terminal width to 80-120 characters when you take the screenshot, so that the screenshot is easily readable.

## Setting up shared folder

A shared folder is a directory can be accessed and used by both the host machine (where VirtualBox is installed) and the guest virtual machine (VM) running within VirtualBox.
This feature allows for the seamless exchange of files between the host[^host] and the VM.

Please create a folder on your host machine and make it accessible to the VM.

!!! question

    It’s common need to check how much storage is available in your VM, and this can be done by running the `df` command.
    Please refer to the man page of `df` by executing `man df` and learn how to

    - output the available storage in a human-readable format, as well as
    - the type of the filesystems.

    Take a screenshot of the command and its output showing the available storage in a human-readable format, along with the type of filesystems. Highlight the line that represents the shared folder.

    Please adjust the terminal width to 80-120 characters when you take the screenshot, so that the screenshot is easily readable.

## Recovery (Optional)

In case you encounter an irreparable issue with the VM, simply repeat the aforementioned steps to set up a new one.
However, any work previously done will be lost.

Creating a snapshot of your virtual machine can be a lifesaver.
A snapshot captures the current state of the virtual machine, which you can revert to at any time.
This means if something goes wrong, you won't lose all your work - you can simply revert to the snapshot.
But that takes up disk space, so use it sparingly.

[^pwd]:
    In case you don't know, the password you type will not be displayed on the screen.
    Please just type it blindly and press "Enter".

[^host]:
    "Host" refers to the machine where VirtualBox is installed and running.
    For instance, if you run VirtualBox locally on your Windows laptop, the "host" refers to Windows.
    If you are using a MacBook with VirtualBox installed remotely on a server, the "host" refers to the remote server rather than your MacBook.
