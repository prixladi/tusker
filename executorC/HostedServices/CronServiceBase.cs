using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Hosting;

namespace Executor.HostedServices;

public abstract class CronServiceBase : BackgroundService
{
    private readonly int timeout;

    public CronServiceBase(int timeout)
    {
        this.timeout = timeout;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            var newDelay = await TickAsync(stoppingToken);
            await Task.Delay(newDelay ?? timeout);
        }
    }

    protected abstract Task<int?> TickAsync(CancellationToken stoppingToken);
}