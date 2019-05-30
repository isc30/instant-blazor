namespace InstantBlazor
{
    type BlazorPlatform = "webassembly" | "server";

    export function init(): void
    {
        var preferWasm = confirm("Do you prefer WebAssembly over ServerSide Blazor?");

        if (preferWasm && isWebAssemblySupported())
        {
            initBlazor("webassembly");
        }
        else
        {
            initBlazor("server");
        }
    }

    function initBlazor(platform: BlazorPlatform): void
    {
        console.info(`Initiating Blazor on Platform: ${platform}`);

        var scriptTag = document.createElement("script");

        scriptTag.src = `_framework/blazor.${platform}.js`;
        scriptTag.async = true;

        document.head.appendChild(scriptTag);
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
