if (!/pnpm/.test(process.env.npm_execpath || '')) {
  console.error(`
    请使用pnpm包管理器下载依赖,以更好的统一管理项目!!!\n
    请使用以下命令安装依赖:
    pnpm install
    没有安装pnpm?请使用以下命令安装:
    npm install -g pnpm
  `)
  process.exit(1) // 退出node进程
}
