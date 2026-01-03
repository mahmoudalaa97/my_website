module.exports = {
  apps: [
    {
      name: "web",
      script: "npm",
      args: "run start --workspace=@repo/web",
    },
    {
      name: "admin",
      script: "npm",
      args: "run start --workspace=@repo/admin",
    },
    {
      name: "api",
      script: "npm",
      args: "run start --workspace=@repo/api",
    }
  ]
}
