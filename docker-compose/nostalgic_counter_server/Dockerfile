FROM debian:stable-slim

WORKDIR /app

RUN apt-get -qq update \
    && apt-get -qq -y install \
    curl \
    zip \
    unzip

RUN curl -fsSL https://deno.land/x/install/install.sh | sh

RUN apt-get -qq -y purge \
    curl \
    zip \
    unzip \
    && apt-get -qq -y autoremove \
    && apt-get -qq clean \
    && rm -rf /var/lib/apt/lists/*

ENV DENO_INSTALL="/root/.deno"
ENV PATH="$DENO_INSTALL/bin:$PATH"

COPY ./.nostalgic_counter_server /root/.nostalgic_counter_server

EXPOSE 20222
ENTRYPOINT ["deno", "run", "--allow-all", "--unstable", "./main.ts"]
