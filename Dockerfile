FROM denoland/deno:alpine
WORKDIR /app

ENV HOST 0.0.0.0
ENV PORT 8080

#RUN adduser -D myuser
#USER myuser

COPY ./nostalgic_counter_server /app
COPY ./_move_to_home_.nostalgic_counter_server /root/.nostalgic_counter_server

CMD ["run", "--allow-read", "--allow-write", "--allow-env", "--allow-net", "main.ts"]

# EXPOSE 20221
