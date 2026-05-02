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
      name: "api-php",
      cwd: "apps/api-php",
      script: "php",
      args: "artisan serve --host=0.0.0.0 --port=8000",
    },
  ],
};
