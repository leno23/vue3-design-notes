import { getCurrentInstance } from './component';

export function provide(key: string, value) {
    const ins = getCurrentInstance();
    if (ins) {
        let { providers } = ins
        const parentProviders = ins.parent.providers
        if (providers == parentProviders) {
            providers = ins.providers = Object.create(parentProviders)
        }
        providers[key] = value
    }
}

export function inject(key: string, defaultValue: any) {
    const ins = getCurrentInstance()
    if (ins) {
        const parentProviders = ins.parent.providers
        if (key in parentProviders) {
            return parentProviders[key]
        } else if (defaultValue) {
            if (typeof defaultValue === 'function') {
                return defaultValue()
            }
            return defaultValue
        }
    }
}