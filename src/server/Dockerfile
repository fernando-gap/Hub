FROM archlinux:latest

RUN pacman -Syu --noconfirm
RUN pacman -S --needed base-devel --noconfirm
RUN pacman -S sudo --noconfirm
RUN pacman -S git --noconfirm
RUN pacman -S nodejs --noconfirm
RUN pacman -S npm --noconfirm


RUN useradd -m docker \
  && echo "docker:docker" | chpasswd

RUN echo "docker ALL=(ALL) NOPASSWD: ALL" >> /etc/sudoers

USER docker
WORKDIR /whatsapp
RUN git clone \
  --single-branch \
  "https://aur.archlinux.org/google-chrome.git" /whatsapp/chrome \
  && cd /whatsapp/chrome \
  && makepkg -sic --noconfirm

COPY package*.json /whatsapp

RUN sudo chown -R "docker:docker" /whatsapp
RUN npm install

COPY src/server/ /whatsapp
EXPOSE $PORT_WPP $PORT_TEMP

USER root
RUN whoami
CMD ["node", "server.js"]
