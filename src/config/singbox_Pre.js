const Config = {
    log: {
        disabled: false,
        level: 'info',
        output: './singbox.log',
        timestamp: true,
    },
    dns: {
        servers: [
            {
                type: 'hosts',
                tag: 'hosts',
                path: ['/etc/hosts', '$HOME/.hosts'],
                predefined: {
                    localhost: ['127.0.0.1'],
                    'dns.alidns.com': ['223.5.5.5', '223.6.6.6'],
                    'dns.google': ['8.8.4.4', '8.8.8.8'],
                },
            },
            {
                tag: 'local',
                type: 'udp',
                server: '223.5.5.5',
            },
            {
                type: 'https',
                tag: 'DIRECT-DNS',
                detour: '🎯 全球直连',
                server: 'dns.alidns.com',
                domain_resolver: 'hosts',
            },
            {
                type: 'https',
                tag: 'PROXY-DNS',
                detour: '🚀 节点选择',
                server: 'dns.google',
                domain_resolver: 'hosts',
            },
        ],
        rules: [
            {
                clash_mode: 'direct',
                server: 'DIRECT-DNS',
            },
            {
                clash_mode: 'global',
                server: 'PROXY-DNS',
            },
            // evaluate 解析并储存ip > 如果等于 cnip 或 cn域名 或 私有域名 用 DIRECT-DNS 再次解析并覆盖结果 > 成功则拦截,失败则继续往下匹配 fallback
            {
                action: 'evaluate',
                server: 'PROXY-DNS',
            },
            {
                type: 'logical',
                mode: 'or',
                rules: [
                    {
                        rule_set: ['cn_ip'],
                        match_response: true,
                    },
                    {
                        rule_set: ['cn_domain', 'private_domain'],
                    },
                ],
                server: 'DIRECT-DNS',
            },
            {
                match_response: true,
                response_rcode: 'NOERROR',
                ip_accept_any: true,
                action: 'respond',
            },
        ],
        final: 'PROXY-DNS',
        strategy: 'prefer_ipv4',
        optimistic: true,
        cache_capacity: 1000,
    },
    inbounds: [
        {
            type: 'tun',
            tag: 'tun-in',
            interface_name: 'singbox',
            address: ['172.18.0.1/30', 'fdfe:dcba:9876::1/126'],
            mtu: 9000,
            auto_route: true,
            strict_route: true,
            endpoint_independent_nat: false,
            stack: 'gvisor',
            udp_timeout: '5m',
            platform: {
                http_proxy: {
                    enabled: true,
                    server: '127.0.0.1',
                    server_port: 7890,
                },
            },
        },
        {
            tag: 'mixed-in',
            type: 'mixed',
            listen: '::',
            listen_port: 7890,
        },
        {
            type: 'http',
            tag: 'http-in',
            listen: '::',
            listen_port: 7892,
        },
        {
            type: 'socks',
            tag: 'socks-in',
            listen: '::',
            listen_port: 7893,
        },
    ],
    outbounds: [
        {
            tag: '🎯 全局直连',
            type: 'direct',
        },
        {
            tag: '🚫 拒绝连接',
            type: 'block',
        },
    ],
    route: {
        auto_detect_interface: true,
        final: '🚀 节点选择',
        default_domain_resolver: {
            server: 'DIRECT-DNS',
            strategy: 'prefer_ipv4',
        },
        rules: [
            {
                action: 'sniff',
            },
            {
                protocol: 'dns',
                network: ['tcp', 'udp'],
                port: [53],
                action: 'hijack-dns',
            },
            {
                ip_is_private: true,
                outbound: '🎯 全球直连',
            },
            {
                clash_mode: 'direct',
                outbound: '🎯 全球直连',
            },
            {
                clash_mode: 'global',
                outbound: '🚀 节点选择',
            },
            {
                action: 'route-options',
            },
        ],
        rule_set: [
            {
                tag: 'cn_ip',
                type: 'remote',
                url: 'https://jsd.onmicrosoft.cn/gh/MetaCubeX/meta-rules-dat@sing/geo/geoip/cn.srs',
                format: 'binary',
                download_detour: '🎯 全球直连',
            },
            {
                tag: 'private_domain',
                type: 'remote',
                url: 'https://jsd.onmicrosoft.cn/gh/MetaCubeX/meta-rules-dat@sing/geo/geosite/private.srs',
                format: 'binary',
                download_detour: '🎯 全球直连',
            },
            {
                tag: 'cn_domain',
                type: 'remote',
                url: 'https://jsd.onmicrosoft.cn/gh/MetaCubeX/meta-rules-dat@sing/geo/geosite/cn.srs',
                format: 'binary',
                download_detour: '🎯 全球直连',
            },
        ],
    },
    services: [
        {
            type: 'api',
            listen: '::',
            listen_port: 9091,
            secret: '',
            access_control_allow_origin: ['*'],
            access_control_allow_private_network: true,
            dashboard: {
                enabled: true,
                path: 'dashboard',
                download_url: 'https://ghfast.top/github.com/SagerNet/sing-box-dashboard/archive/refs/heads/gh-pages.zip',
                http_client: 'DIRECT-clients',
                update_interval: '1d',
            },
        }
    ],
    experimental: {
        clash_api: {
            external_controller: '0.0.0.0:9090',
            external_ui: 'ui',
            secret: '',
            default_mode: 'rule',
            external_ui_download_url: 'https://ghfast.top/https://github.com/Zephyruso/zashboard/archive/refs/heads/gh-pages.zip',
            external_ui_download_detour: '🎯 全球直连',
            access_control_allow_origin: ['*'],
            access_control_allow_private_network: true,
        },
        cache_file: {
            enabled: true,
            path: 'cache.db',
            cache_id: '',
            store_fakeip: true,
            store_dns: true,
            rdrc_timeout: '1d',
        },
    },
};
const ConfigPre = Object.freeze(Config);
export { ConfigPre }
