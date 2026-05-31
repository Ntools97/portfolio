// ═══════════════════════════════════════════════
//  Simple Static File Server - Portfolio
//  Chạy file này để serve portfolio local
//  Mở browser: http://localhost:8080
// ═══════════════════════════════════════════════

using System;
using System.IO;
using System.Net;
using System.Threading.Tasks;
using System.Diagnostics;
using System.Collections.Generic;

class PortfolioServer
{
    static readonly string ROOT = Directory.GetCurrentDirectory();
    static readonly int PORT = 8080;

    static readonly Dictionary<string, string> MimeTypes = new()
    {
        { ".html",  "text/html; charset=utf-8"       },
        { ".css",   "text/css"                        },
        { ".js",    "application/javascript"          },
        { ".json",  "application/json"                },
        { ".png",   "image/png"                       },
        { ".jpg",   "image/jpeg"                      },
        { ".jpeg",  "image/jpeg"                      },
        { ".gif",   "image/gif"                       },
        { ".svg",   "image/svg+xml"                   },
        { ".ico",   "image/x-icon"                    },
        { ".ifc",   "application/octet-stream"        },
        { ".wasm",  "application/wasm"                },
        { ".ttf",   "font/ttf"                        },
        { ".woff",  "font/woff"                       },
        { ".woff2", "font/woff2"                      },
    };

    static async Task Main()
    {
        var url = $"http://localhost:{PORT}/";
        var listener = new HttpListener();
        listener.Prefixes.Add(url);
        listener.Start();

        Console.ForegroundColor = ConsoleColor.Cyan;
        Console.WriteLine("╔══════════════════════════════════════╗");
        Console.WriteLine("║     Portfolio Server - Nhat Tran     ║");
        Console.WriteLine("╚══════════════════════════════════════╝");
        Console.ResetColor();
        Console.ForegroundColor = ConsoleColor.Green;
        Console.WriteLine($"\n  ✓ Server running at: {url}");
        Console.WriteLine($"  ✓ Serving folder:    {ROOT}");
        Console.ResetColor();
        Console.WriteLine("\n  Press Ctrl+C to stop.\n");

        // Auto open browser
        try
        {
            Process.Start(new ProcessStartInfo
            {
                FileName        = url,
                UseShellExecute = true
            });
        }
        catch { /* browser open failed, that's ok */ }

        while (listener.IsListening)
        {
            try
            {
                var ctx = await listener.GetContextAsync();
                _ = Task.Run(() => HandleRequest(ctx));
            }
            catch { break; }
        }
    }

    static void HandleRequest(HttpListenerContext ctx)
    {
        var req  = ctx.Request;
        var res  = ctx.Response;
        var path = req.Url?.LocalPath ?? "/";

        // CORS headers (needed for WASM)
        res.Headers.Add("Access-Control-Allow-Origin", "*");
        res.Headers.Add("Cross-Origin-Opener-Policy",  "same-origin");
        res.Headers.Add("Cross-Origin-Embedder-Policy","require-corp");

        if (path == "/") path = "/index.html";

        var filePath = Path.Combine(ROOT, path.TrimStart('/').Replace('/', Path.DirectorySeparatorChar));

        Console.ForegroundColor = ConsoleColor.DarkGray;
        Console.WriteLine($"  {req.HttpMethod} {path}");
        Console.ResetColor();

        if (File.Exists(filePath))
        {
            var ext  = Path.GetExtension(filePath).ToLower();
            var mime = MimeTypes.TryGetValue(ext, out var m) ? m : "application/octet-stream";

            var bytes = File.ReadAllBytes(filePath);
            res.StatusCode  = 200;
            res.ContentType = mime;
            res.ContentLength64 = bytes.Length;
            res.OutputStream.Write(bytes, 0, bytes.Length);
        }
        else
        {
            Console.ForegroundColor = ConsoleColor.Yellow;
            Console.WriteLine($"  404: {filePath}");
            Console.ResetColor();

            res.StatusCode = 404;
            var msg = System.Text.Encoding.UTF8.GetBytes($"404 - Not Found: {path}");
            res.OutputStream.Write(msg, 0, msg.Length);
        }

        res.OutputStream.Close();
    }
}
