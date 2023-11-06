const express = require("express");
const { GracefulShutdownServer } = require("medusa-core-utils");

const loaders = require("@medusajs/medusa/dist/loaders/index").default;
//
const { Server: SocketIOServer } = require("socket.io");
const { createServer } = require("http");
//
(async () => {
  async function start() {
    const app = express();
    const directory = process.cwd();
    //
    const httpServer = createServer(app);
    const io = new SocketIOServer(httpServer);

    io.on("connection", (socket) => {
      console.log(`A user connected: ${socket.id}`);

      socket.on("CUSTOMER:AUTHORIZATION", (data) => {
        console.log("Data", data);
        io.emit("CUSTOMER:RESPONSE", data);
      });

      socket.on("disconnect", () => {
        console.log(`User disconnected: ${socket.id}`);
      });
    });
    //
    try {
      const { container } = await loaders({
        directory,
        expressApp: app,
      });
      const configModule = container.resolve("configModule");
      const port = process.env.PORT ?? configModule.projectConfig.port ?? 9000;

      const server = GracefulShutdownServer.create(
        // app.listen(port, (err) => {
        //   if (err) {
        //     return;
        //   }
        //   console.log(`Server is ready on port: ${port}`);
        // })
        //
        httpServer.listen(port,  (err) => {
          if (err) {
            return;
          }
          console.log(`Server is ready on port: ${port}`);
        })
        //
      );

      // Handle graceful shutdown
      const gracefulShutDown = () => {
        server
          .shutdown()
          .then(() => {
            console.info("Gracefully stopping the server.");
            process.exit(0);
          })
          .catch((e) => {
            console.error("Error received when shutting down the server.", e);
            process.exit(1);
          });
      };
      process.on("SIGTERM", gracefulShutDown);
      process.on("SIGINT", gracefulShutDown);
    } catch (err) {
      console.error("Error starting server", err);
      process.exit(1);
    }
  }

  await start();
})();






// const express = require("express");
// const { GracefulShutdownServer } = require("medusa-core-utils");

// const loaders = require("@medusajs/medusa/dist/loaders/index").default;

// (async () => {
//   async function start() {
//     const app = express();
//     const directory = process.cwd();

//     try {
//       const { container } = await loaders({
//         directory,
//         expressApp: app,
//       });
//       const configModule = container.resolve("configModule");
//       const port = process.env.PORT ?? configModule.projectConfig.port ?? 9000;

//       const server = GracefulShutdownServer.create(
//         app.listen(port, (err) => {
//           if (err) {
//             return;
//           }
//           console.log(`Server is ready on port: ${port}`);
//         })
//       );

//       // Handle graceful shutdown
//       const gracefulShutDown = () => {
//         server
//           .shutdown()
//           .then(() => {
//             console.info("Gracefully stopping the server.");
//             process.exit(0);
//           })
//           .catch((e) => {
//             console.error("Error received when shutting down the server.", e);
//             process.exit(1);
//           });
//       };
//       process.on("SIGTERM", gracefulShutDown);
//       process.on("SIGINT", gracefulShutDown);
//     } catch (err) {
//       console.error("Error starting server", err);
//       process.exit(1);
//     }
//   }

//   await start();
// })();