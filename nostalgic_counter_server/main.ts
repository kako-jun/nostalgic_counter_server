import App from "./app.ts";

const main = async () => {
  console.log("main.ts start");

  const app = new App();
  await app.start();
};

main();

export default main;
