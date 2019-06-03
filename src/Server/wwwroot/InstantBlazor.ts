interface Window
{
    Blazor:
    {
        start: (params: object) => void,
    }
}

namespace InstantBlazor
{
    type BlazorPlatform = "webassembly" | "server";

    export function init(): void
    {
        var preferWasm = confirm("Do you prefer WebAssembly over ServerSide Blazor?");

        if (preferWasm && isWebAssemblySupported())
        {
            bootBlazor("webassembly", true);
        }
        else
        {
            bootBlazor("server", true);
        }
    }

    function bootBlazor(platform: BlazorPlatform, autoStart: boolean): void
    {
        console.info(`Booting Blazor on Platform: ${platform}`);

        var scriptTag = document.createElement("script");

        scriptTag.setAttribute("src", `_framework/blazor.${platform}.js`);
        scriptTag.setAttribute("async", "true");
        scriptTag.setAttribute("autostart", "false");

        if (autoStart)
        {
            scriptTag.onload = () =>
            {
                startBlazor();
            }
        }

        document.head.appendChild(scriptTag);
    }

    function startBlazor(): void
    {
        window.Blazor.start();
    }

    function isWebAssemblySupported(): boolean
    {
        try
        {
            if (typeof WebAssembly === "object"
                && typeof WebAssembly.instantiate === "function")
            {
                const dummyModule = new WebAssembly.Module(
                    Uint8Array.of(0x0, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00));

                if (dummyModule instanceof WebAssembly.Module)
                {
                    const instance = new WebAssembly.Instance(dummyModule);

                    return (instance instanceof WebAssembly.Instance);
                }
            }
        }
        catch (ex) { }

        return false;
    }
}
