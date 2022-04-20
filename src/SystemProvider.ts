import { ProviderOptions, Provider } from "@master-list/core";
import * as os from "os";

export interface SystemOptions extends ProviderOptions {
  showDate?: boolean;
  showCpu?: boolean;
  showMemory?: boolean;
}

export const defaultOptions: SystemOptions = {
  providerName: "System",
  showDate: true,
  showCpu: true,
  showMemory: true,
};

export class SystemProvider extends Provider {
  constructor(public options: SystemOptions = defaultOptions) {
    super({
      ...defaultOptions,
      ...options,
    });
  }

  reload() {
    return super.reload(async () => {
      return this.getSystemData();
    });
  }

  getSystemData(): string[] {
    const items = [];

    if (this.settings.showDate) {
      items.push(this.getDate());
    }

    if (this.settings.showCpu) {
      items.push(this.getCpu());
    }

    if (this.settings.showMemory) {
      items.push(this.getMemory());
    }

    return items;
  }

  getDate() {
    return `${new Date().toLocaleString()}`;
  }

  getCpu(): string {
    const cpus = os.cpus();
    let cpuString = "CPU: ";
    for (var i = 0, len = cpus.length; i < len; i++) {
      const cpu = cpus[i];
      let total = 0;
      for (var type in cpu.times) {
        total += cpu.times[type];
      }

      cpuString += `${Math.round(((total - cpu.times.idle) / total) * 100)}% `;
    }
    return cpuString;
  }

  getMemory(): string {
    return `Memory: ${Math.round(
      (os.totalmem() - os.freemem()) / 1000 / 1000
    )}/${Math.round(os.totalmem() / 1000 / 1000)} MB (${Math.round(
      ((os.totalmem() - os.freemem()) / os.totalmem()) * 100
    )}%)`;
  }
}
