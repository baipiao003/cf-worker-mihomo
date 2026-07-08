import configs from './config.js';

export async function getFakePage(e) {
    let configData = JSON.parse(configs(e.tplmh, e.tplsb));
    if (e.templateBaseUrl) {
        try {
            const res = await fetch(`${e.templateBaseUrl}/templates.json`);
            if (res.ok) {
                const externalTemplates = await res.json();
                for (const [target, templates] of Object.entries(externalTemplates)) {
                    if (configData[target]) {
                        configData[target].templates = templates;
                    }
                }
            }
        } catch (_) {}
    }
    const configJson = JSON.stringify(configData);
    return `
<!DOCTYPE html>
<html lang="zh-CN">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
    <link rel="icon" type="image/png" href="https://cdn.jsdelivr.net/gh/Kwisma/cf-worker-mihomo@main/favicon.png">
    <title>星尘配置转换 · 订阅转换</title>
    <script src="https://cdn.jsdelivr.net/npm/@keeex/qrcodejs-kx@1.0.2/qrcode.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/dompurify@3.0.5/dist/purify.min.js"></script>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        :root {
            --primary: #6366f1;
            --primary-dark: #4f46e5;
            --primary-soft: #818cf8;
            --accent: #22d3ee;
            --bg-glass: rgba(255, 255, 255, 0.75);
            --card-bg: rgba(255, 255, 255, 0.9);
            --text-dark: #0f172a;
            --text-muted: #475569;
            --border-light: #e2e8f0;
            --shadow-sm: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.02);
            --shadow-md: 0 20px 35px -12px rgba(0, 0, 0, 0.1);
            --success: #10b981;
            --error: #ef4444;
        }

        body {
            background: url(${e.IMG});
            font-family: 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, sans-serif;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 24px;
            position: relative;
        }

        body::before {
            content: "";
            position: fixed;
            inset: 0;
            background: radial-gradient(circle at 20% 40%, rgba(99, 102, 241, 0.12), transparent 50%);
            pointer-events: none;
        }

        .glass-container {
            max-width: 760px;
            width: 100%;
            background: var(--bg-glass);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            border-radius: 2.5rem;
            padding: 1.8rem;
            box-shadow: var(--shadow-md), inset 0 1px 0 rgba(255, 255, 255, 0.6);
            border: 1px solid rgba(255, 255, 255, 0.4);
            transition: all 0.2s ease;
            z-index: 2;
        }

        .hero {
            text-align: center;
            margin-bottom: 2rem;
        }

        .hero h1 {
            font-size: 2.1rem;
            font-weight: 700;
            background: linear-gradient(135deg, var(--primary-dark), var(--accent));
            background-clip: text;
            -webkit-background-clip: text;
            color: transparent;
            letter-spacing: -0.3px;
        }

        .hero .badge {
            display: inline-block;
            background: rgba(99, 102, 241, 0.12);
            backdrop-filter: blur(4px);
            border-radius: 40px;
            padding: 4px 12px;
            font-size: 0.75rem;
            font-weight: 500;
            color: var(--primary-dark);
            margin-top: 8px;
        }

        .mode-panel {
            display: none;
            animation: fadeSlideUp 0.25s ease-out;
        }

        .mode-panel.active {
            display: block;
        }

        @keyframes fadeSlideUp {
            from {
                opacity: 0;
                transform: translateY(8px);
            }

            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .form-card {
            background: var(--card-bg);
            border-radius: 1.75rem;
            padding: 1.25rem 1.5rem;
            margin-bottom: 1.5rem;
            border: 1px solid var(--border-light);
            transition: box-shadow 0.2s;
        }

        .form-card:hover {
            box-shadow: var(--shadow-sm);
        }

        .section-title {
            font-size: 0.9rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: var(--text-muted);
            margin-bottom: 1rem;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        /* 模板选择器 */
        .template-trigger {
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: #f8fafc;
            border: 1.5px solid var(--border-light);
            border-radius: 1.25rem;
            padding: 12px 16px;
            font-size: 0.9rem;
            cursor: pointer;
            transition: all 0.2s;
        }

        .template-trigger span:first-child {
            color: var(--text-dark);
            font-weight: 500;
        }

        .template-trigger span:last-child {
            color: var(--primary);
            font-weight: 500;
        }

        .template-dropdown {
            margin-top: 8px;
            background: white;
            border-radius: 1.25rem;
            border: 1px solid var(--border-light);
            max-height: 280px;
            overflow-y: auto;
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
            display: none;
        }

        .template-dropdown.open {
            display: block;
            animation: fadeSlideUp 0.15s;
        }

        .template-group {
            padding: 6px 0;
        }

        .template-group-header {
            font-size: 0.7rem;
            font-weight: 700;
            padding: 8px 16px 4px;
            color: #6c757d;
            letter-spacing: 0.5px;
            background: #f9fafb;
            position: sticky;
            top: 0;
            z-index: 1;
        }

        .template-opt {
            padding: 10px 20px;
            cursor: pointer;
            transition: background 0.1s;
            font-size: 0.85rem;
            border-left: 3px solid transparent;
        }

        .template-opt:hover {
            background: #f1f5f9;
        }

        .template-opt.selected {
            background: #eef2ff;
            border-left-color: var(--primary);
            font-weight: 500;
            color: var(--primary-dark);
        }

        .links-area {
            margin-top: 12px;
        }

        .link-row {
            display: flex;
            gap: 12px;
            margin-bottom: 12px;
            align-items: center;
        }

        .link-input {
            flex: 1;
            padding: 12px 14px;
            border: 1.5px solid var(--border-light);
            border-radius: 1.25rem;
            font-size: 0.85rem;
            transition: 0.2s;
            background: white;
        }

        .link-input:focus {
            outline: none;
            border-color: var(--primary);
            box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
        }

        .add-btn-circle {
            width: 44px;
            height: 44px;
            background: linear-gradient(135deg, var(--primary), var(--primary-soft));
            border-radius: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            color: white;
            font-size: 1.3rem;
            font-weight: 500;
            transition: all 0.2s;
            box-shadow: 0 4px 8px rgba(99, 102, 241, 0.3);
        }

        .add-btn-circle:hover {
            transform: scale(1.03);
            background: var(--primary-dark);
        }

        .checkbox-group {
            display: flex;
            flex-wrap: wrap;
            gap: 12px;
            margin-top: 8px;
        }

        .checkbox-group label {
            display: flex;
            align-items: center;
            gap: 6px;
            font-size: 0.85rem;
            background: #f1f5f9;
            padding: 6px 14px;
            border-radius: 40px;
            cursor: pointer;
            transition: all 0.1s;
        }

        .checkbox-group label:hover {
            background: #e2e8f0;
        }

        .checkbox-group input {
            accent-color: var(--primary);
            width: 16px;
            height: 16px;
            margin: 0;
        }

        .generate-btn {
            width: 100%;
            padding: 14px;
            background: linear-gradient(105deg, var(--primary), var(--primary-dark));
            border: none;
            border-radius: 2rem;
            font-weight: 700;
            font-size: 1rem;
            color: white;
            cursor: pointer;
            transition: all 0.2s;
            margin-top: 6px;
            margin-bottom: 20px;
            box-shadow: 0 10px 15px -6px rgba(79, 70, 229, 0.4);
        }

        .generate-btn:hover {
            transform: translateY(-2px);
            filter: brightness(1.02);
        }

        .result-card {
            background: #ffffffdd;
            backdrop-filter: blur(8px);
            border-radius: 1.5rem;
            padding: 0.2rem 0 0.8rem 0;
        }

        .result-header {
            display: flex;
            justify-content: space-between;
            align-items: baseline;
            padding: 12px 18px 6px 18px;
            font-size: 0.85rem;
            font-weight: 600;
            color: var(--text-muted);
            letter-spacing: normal;
            flex-wrap: wrap;
        }

        .result-header span:first-child {
            font-size: 0.85rem;
            font-weight: 600;
            white-space: nowrap;
        }

        .copy-hint {
            cursor: pointer;
            background: rgba(99, 102, 241, 0.08);
            padding: 4px 12px;
            border-radius: 40px;
            font-size: 0.7rem;
            font-weight: 500;
            transition: 0.1s;
        }

        .copy-hint:hover {
            background: rgba(99, 102, 241, 0.2);
        }

        #result {
            background: #fefefe;
            border: 1px solid var(--border-light);
            border-radius: 1.25rem;
            padding: 14px 18px;
            font-family: 'SF Mono', 'Fira Code', monospace;
            font-size: 0.8rem;
            width: 100%;
            cursor: pointer;
            word-break: break-all;
            margin: 0 0 6px 0;
            line-height: 1.4;
        }

        #qrcode {
            display: flex;
            justify-content: center;
            padding: 12px 0 6px;
            margin-top: 4px;
            border-top: 1px dashed var(--border-light);
        }

        .hidden-qr {
            display: none;
        }

        .tip-icon-sm {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            background: var(--primary-soft);
            color: white;
            width: 20px;
            height: 20px;
            border-radius: 30px;
            font-size: 12px;
            font-weight: bold;
            cursor: pointer;
            margin-left: 6px;
            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
        }

        .tip-pop {
            position: relative;
            display: inline-block;
        }

        .tip-content {
            position: absolute;
            top: 28px;
            left: -20px;
            width: 300px;
            background: white;
            border-radius: 20px;
            padding: 16px;
            font-size: 0.8rem;
            box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
            border: 1px solid var(--border-light);
            z-index: 30;
            opacity: 0;
            visibility: hidden;
            transition: 0.15s;
            pointer-events: none;
            color: var(--text-dark);
            line-height: 1.5;
            text-align: left;
        }

        .tip-content p,
        .tip-content ul,
        .tip-content ol,
        .tip-content h1,
        .tip-content h2,
        .tip-content h3,
        .tip-content h4,
        .tip-content blockquote {
            margin: 0 0 8px 0;
            padding-left: 0;
        }

        .tip-content ul,
        .tip-content ol {
            padding-left: 20px;
        }

        .tip-content li {
            margin-bottom: 4px;
        }

        .tip-content h2,
        .tip-content h3 {
            font-size: 0.9rem;
            font-weight: 700;
            margin-top: 8px;
            margin-bottom: 6px;
        }

        .tip-content strong,
        .tip-content b {
            color: var(--primary-dark);
        }

        .tip-pop.active .tip-content {
            opacity: 1;
            visibility: visible;
            pointer-events: auto;
        }

        .tip-content a {
            color: var(--primary);
        }

        .github-corner {
            position: fixed;
            top: 0px;
            right: 0px;
            z-index: 50;
        }

        .beian {
            text-align: center;
            font-size: 0.7rem;
            padding-top: 1rem;
            color: #6c757d;
        }

        @media (max-width: 560px) {
            .glass-container {
                padding: 1.2rem;
            }

            .checkbox-group label {
                font-size: 0.75rem;
                padding: 4px 12px;
            }

            .result-header span:first-child {
                white-space: normal;
                font-size: 0.8rem;
            }
        }
    </style>
</head>

<body>

    <div class="glass-container">
        <div class="hero">
            <h1>⚡ 星尘转换器</h1>
            <div class="badge">多合一订阅</div>
        </div>

        <!-- 模式选择器 - 与模板选择器样式一致 -->
        <div class="form-card">
            <div class="section-title">📱 选择客户端类型</div>
            <div class="template-trigger" id="modeTrigger">
                <span>当前客户端</span>
                <span id="selectedModeLabel">Clash(mihomo)</span>
            </div>
            <div class="template-dropdown" id="modeDropdown"></div>
        </div>

        <div id="panelsContainer"></div>

        <!-- 结果区 -->
        <div class="result-card">
            <div class="result-header">
                <span>📋 订阅地址 (点击输入框复制)</span>
                <span class="copy-hint" id="copyToastBtn">📎 一键复制</span>
            </div>
            <input type="text" id="result" readonly onclick="copyToClipboard()">
            <div id="qrcode" class="hidden-qr"></div>
        </div>
        <div class="beian">
            <a href="${e.beianurl}" style="color: var(--primary-dark); text-decoration: none;">${e.beian}</a>
        </div>
    </div>

    <a href="https://github.com/Kwisma/cf-worker-mihomo" target="_blank" class="github-corner" aria-label="GitHub">
        <svg width="48" height="48" viewBox="0 0 250 250" style="fill:#6366f1; color:white;">
            <path d="M0,0 L115,115 L130,115 L142,142 L250,250 L250,0 Z"></path>
            <path
                d="M128.3,109.0 C113.8,99.7 119.0,89.6 119.0,89.6 C122.0,82.7 120.5,78.6 120.5,78.6 C119.2,72.0 123.4,76.3 123.4,76.3 C127.3,80.9 125.5,87.3 125.5,87.3 C122.9,97.6 130.6,101.9 134.4,103.2"
                fill="currentColor" class="octo-arm"></path>
            <path
                d="M115.0,115.0 C114.9,115.1 118.7,116.5 119.8,115.4 L133.7,101.6 C136.9,99.2 139.9,98.4 142.2,98.6 C133.8,88.0 127.5,74.4 143.8,58.0 C148.5,53.4 154.0,51.2 159.7,51.0 C160.3,49.4 163.2,43.6 171.4,40.1 C171.4,40.1 176.1,42.5 178.8,56.2 C183.1,58.6 187.2,61.8 190.9,65.4 C194.5,69.0 197.7,73.2 200.1,77.6 C213.8,80.2 216.3,84.9 216.3,84.9 C212.7,93.1 206.9,96.0 205.4,96.6 C205.1,102.4 203.0,107.8 198.3,112.5 C181.9,128.9 168.3,122.5 157.7,114.1 C157.9,116.9 156.7,120.9 152.7,124.9 L141.0,136.5 C139.8,137.7 141.6,141.9 141.8,141.8 Z"
                fill="currentColor" class="octo-body"></path>
        </svg>
    </a>

    <script>
        const MODES_META = ${configJson};

        let currentMode = 'mihomo';

        function updateResultAndQR(url) {
            const resultInput = document.getElementById('result');
            resultInput.value = url || '';
            const qrContainer = document.getElementById('qrcode');
            if (url && url.trim() !== "") {
                qrContainer.classList.remove('hidden-qr');
                qrContainer.innerHTML = "";
                new QRCode(qrContainer, {
                    text: url,
                    width: 200,
                    height: 200,
                    colorDark: "#4f46e5",
                    colorLight: "#ffffff",
                    correctLevel: QRCode.CorrectLevel.M
                });
            } else {
                qrContainer.classList.add('hidden-qr');
                qrContainer.innerHTML = "";
            }
        }

        window.copyToClipboard = function () {
            const val = document.getElementById('result').value;
            if (!val) return;
            navigator.clipboard.writeText(val).then(() => {
                showToast('✓ 已复制到剪贴板', 'success');
            }).catch(() => alert("手动复制链接"));
        };

        document.getElementById('copyToastBtn')?.addEventListener('click', () => window.copyToClipboard());

        function generateConfigForMode(modeId) {
            const container = document.getElementById(\`panel-\${modeId}\`);
            if (!container) return;
            const linkInputs = container.querySelectorAll('.dynamic-link-input');
            const links = Array.from(linkInputs).map(inp => inp.value.trim()).filter(v => v !== "");
            let templateVal = '';
            const selectedTmpl = container.querySelector('.template-opt.selected');
            if (selectedTmpl) templateVal = selectedTmpl.dataset.value;
            // 获取 checkbox 参数
            const checkboxes = container.querySelectorAll('.proto-check');
            const protocolParams = {};
            checkboxes.forEach(cb => { protocolParams[cb.value] = cb.checked; });
            // 获取所有下拉框的值（通用）
            const selects = container.querySelectorAll('.proto-select');
            selects.forEach(select => {
                const protoName = select.getAttribute('data-proto');
                if (select.value) {
                    protocolParams[protoName] = select.value;
                }
            });
            if (links.length === 0 && !templateVal) {
                alert('请至少填写一个订阅链接或选择一个模板');
                return;
            }

            const origin = window.location.origin;
            const params = new URLSearchParams();
            if (templateVal) params.set('template', templateVal);
            if (links.length) params.set('url', links.join(','));
            params.set('target', modeId);
            // 统一设置参数
            for (const [key, value] of Object.entries(protocolParams)) {
                if (value === true) {
                    params.set(key, 'true');
                } else if (typeof value === 'string' && value) {
                    params.set(key, value);
                }
            }
            const fullUrl = \`\${origin}/?\${params.toString()}\`;

            updateResultAndQR(fullUrl);

            if (fullUrl) {
                navigator.clipboard.writeText(fullUrl).then(() => {
                    showToast('✓ 订阅链接已复制到剪贴板', 'success');
                }).catch(() => {
                    showToast('✗ 复制失败，请手动复制', 'error');
                });
            }
        }

        function showToast(message, type = 'success') {
            const toast = document.createElement('div');
            toast.innerText = message;
            toast.style.position = 'fixed';
            toast.style.bottom = '20px';
            toast.style.left = '50%';
            toast.style.transform = 'translateX(-50%)';
            toast.style.background = type === 'success' ? '#10b981' : '#ef4444';
            toast.style.color = 'white';
            toast.style.padding = '10px 24px';
            toast.style.borderRadius = '40px';
            toast.style.fontSize = '0.85rem';
            toast.style.zIndex = '999';
            toast.style.fontWeight = 'bold';
            toast.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
            document.body.appendChild(toast);
            setTimeout(() => toast.remove(), 2000);
        }

        function addLinkRow(containerId, modeId) {
            const linksContainer = document.getElementById(containerId);
            if (!linksContainer) return;
            const newRow = document.createElement('div');
            newRow.className = 'link-row';
            const input = document.createElement('input');
            input.type = 'text';
            input.className = 'link-input dynamic-link-input';
            input.placeholder = MODES_META[modeId]?.placeholder || '输入订阅地址';
            const addBtn = document.createElement('div');
            addBtn.className = 'add-btn-circle';
            addBtn.innerText = '＋';
            addBtn.onclick = () => addLinkRow(containerId, modeId);
            newRow.appendChild(input);
            newRow.appendChild(addBtn);
            linksContainer.appendChild(newRow);
        }

        function buildModePanel(modeId, meta) {
            const panel = document.createElement('div');
            panel.id = \`panel-\${modeId}\`;
            panel.className = 'mode-panel';

            if (!meta.noTemplate && meta.templates) {
                const templateCard = document.createElement('div');
                templateCard.className = 'form-card';
                templateCard.innerHTML = \`<div class="section-title">📁 配置模板</div>
                                      <div class="template-trigger" id="trigger-\${modeId}">
                                          <span>当前模板</span>
                                          <span id="selectedLabel-\${modeId}">未选择 (默认)</span>
                                      </div>
                                      <div class="template-dropdown" id="dropdown-\${modeId}"></div>\`;
                panel.appendChild(templateCard);
                const dropdownDiv = templateCard.querySelector(\`#dropdown-\${modeId}\`);
                const trigger = templateCard.querySelector(\`#trigger-\${modeId}\`);
                const selectedSpan = templateCard.querySelector(\`#selectedLabel-\${modeId}\`);

                for (const [groupName, opts] of Object.entries(meta.templates)) {
                    const groupDiv = document.createElement('div');
                    groupDiv.className = 'template-group';
                    const header = document.createElement('div');
                    header.className = 'template-group-header';
                    header.innerText = groupName;
                    groupDiv.appendChild(header);
                    opts.forEach(opt => {
                        const optDiv = document.createElement('div');
                        optDiv.className = 'template-opt';
                        optDiv.innerText = opt.label;
                        optDiv.dataset.value = opt.value;
                        optDiv.addEventListener('click', (e) => {
                            e.stopPropagation();
                            dropdownDiv.querySelectorAll('.template-opt').forEach(el => el.classList.remove('selected'));
                            optDiv.classList.add('selected');
                            selectedSpan.innerText = opt.label;
                            dropdownDiv.classList.remove('open');
                        });
                        groupDiv.appendChild(optDiv);
                    });
                    dropdownDiv.appendChild(groupDiv);
                }
                const firstOpt = dropdownDiv.querySelector('.template-opt');
                if (firstOpt) {
                    firstOpt.classList.add('selected');
                    selectedSpan.innerText = firstOpt.innerText;
                }
                trigger.addEventListener('click', (e) => {
                    e.stopPropagation();
                    dropdownDiv.classList.toggle('open');
                });
                document.addEventListener('click', (e) => {
                    if (!trigger.contains(e.target) && !dropdownDiv.contains(e.target)) dropdownDiv.classList.remove('open');
                });
            }

            const linkCard = document.createElement('div');
            linkCard.className = 'form-card';
            const linkHeader = document.createElement('div');
            linkHeader.className = 'section-title';
            linkHeader.innerHTML = \`🔗 订阅链接 <div class="tip-pop" id="tip-\${modeId}"><span class="tip-icon-sm">?</span><div class="tip-content"></div></div>\`;
            linkCard.appendChild(linkHeader);
            const linksWrapper = document.createElement('div');
            linksWrapper.id = \`links-wrapper-\${modeId}\`;
            linksWrapper.className = 'links-area';
            const firstRow = document.createElement('div');
            firstRow.className = 'link-row';
            const firstInput = document.createElement('input');
            firstInput.type = 'text';
            firstInput.className = 'link-input dynamic-link-input';
            firstInput.placeholder = meta.placeholder;
            const addFirstBtn = document.createElement('div');
            addFirstBtn.className = 'add-btn-circle';
            addFirstBtn.innerText = '＋';
            addFirstBtn.onclick = () => addLinkRow(\`links-wrapper-\${modeId}\`, modeId);
            firstRow.appendChild(firstInput);
            firstRow.appendChild(addFirstBtn);
            linksWrapper.appendChild(firstRow);
            linkCard.appendChild(linksWrapper);
            panel.appendChild(linkCard);
            if (meta.protocolList && meta.protocolList.length) {
                const protoCard = document.createElement('div');
                protoCard.className = 'form-card';
                protoCard.innerHTML = \`<div class="section-title">⚙️ 附加参数</div><div class="checkbox-group" id="proto-group-\${modeId}"></div>\`;
                const groupDiv = protoCard.querySelector(\`#proto-group-\${modeId}\`);
    
                meta.protocolList.forEach(proto => {
                    const protoConfig = meta.protocolLabels[proto];
        
                    // 通用判断：如果是对象且有 levels 属性，则渲染为下拉框
                    if (protoConfig && typeof protoConfig === 'object' && protoConfig.levels) {
                        // 下拉框处理（通用）
                        const selectContainer = document.createElement('div');
                        selectContainer.style.display = 'flex';
                        selectContainer.style.alignItems = 'center';
                        selectContainer.style.gap = '12px';
                        selectContainer.style.marginBottom = '8px';
                        selectContainer.style.flexWrap = 'wrap';

                        const selectLabel = document.createElement('span');
                        const select = document.createElement('select');
                        select.className = 'proto-select';
                        select.setAttribute('data-proto', proto);
                        select.style.padding = '6px 12px';
                        select.style.borderRadius = '30px';
                        select.style.border = '1.5px solid var(--border-light)';
                        select.style.backgroundColor = 'white';
                        select.style.fontSize = '0.85rem';
                        select.style.cursor = 'pointer';

                        // 添加默认选项
                        const defaultOption = document.createElement('option');
                        defaultOption.value = '';
                        defaultOption.innerText = \`请选择\${protoConfig.label || proto}\`;
                        select.appendChild(defaultOption);
    
                        // 添加各级别选项
                        protoConfig.levels.forEach(level => {
                            const option = document.createElement('option');
                            option.value = level;
                            option.innerText = level;
                            select.appendChild(option);
                        });

                        selectContainer.appendChild(selectLabel);
                        selectContainer.appendChild(select);
                        groupDiv.appendChild(selectContainer);
                    } else {
                        // 复选框处理（字符串或没有 levels 的对象）
                        const label = document.createElement('label');
                        const labelText = (typeof protoConfig === 'object' && protoConfig.label) ? protoConfig.label : (protoConfig || proto);
                        label.innerHTML = \`<input type="checkbox" class="proto-check" value="\${proto}"> <span>\${labelText}</span>\`;
                        groupDiv.appendChild(label);
                    }
                });
                panel.appendChild(protoCard);
            }

            const genBtn = document.createElement('button');
            genBtn.className = 'generate-btn';
            genBtn.innerText = \`✨ 生成 \${meta.name} 订阅链接\`;
            genBtn.onclick = () => generateConfigForMode(modeId);
            panel.appendChild(genBtn);

            setTimeout(() => {
                const tipWrap = linkCard.querySelector(\`#tip-\${modeId}\`);
                if (tipWrap) {
                    const contentDiv = tipWrap.querySelector('.tip-content');
                    const rawMarkdown = meta.tipMarkdown;
                    contentDiv.innerHTML = DOMPurify.sanitize(marked.parse(rawMarkdown));
                    const tipIcon = tipWrap.querySelector('.tip-icon-sm');
                    tipIcon.addEventListener('click', (e) => {
                        e.stopPropagation();
                        tipWrap.classList.toggle('active');
                    });
                    document.addEventListener('click', (e) => {
                        if (!tipWrap.contains(e.target)) tipWrap.classList.remove('active');
                    });
                }
            }, 10);
            return panel;
        }

        function initApp() {
            const modeTrigger = document.getElementById('modeTrigger');
            const modeDropdown = document.getElementById('modeDropdown');
            const selectedModeLabel = document.getElementById('selectedModeLabel');
            const panelsContainer = document.getElementById('panelsContainer');
            panelsContainer.innerHTML = '';
            modeDropdown.innerHTML = '';
            for (const [modeId, meta] of Object.entries(MODES_META)) {
                const optDiv = document.createElement('div');
                optDiv.className = 'template-opt';
                optDiv.innerText = meta.name;
                optDiv.dataset.modeId = modeId;
                optDiv.addEventListener('click', (e) => {
                    e.stopPropagation();
                    modeDropdown.querySelectorAll('.template-opt').forEach(el => el.classList.remove('selected'));
                    optDiv.classList.add('selected');
                    selectedModeLabel.innerText = meta.name;
                    modeDropdown.classList.remove('open');
                    setActiveMode(modeId);
                });
                modeDropdown.appendChild(optDiv);
            }

            // 默认选中 mihomo
            const defaultOpt = Array.from(modeDropdown.querySelectorAll('.template-opt')).find(opt => opt.dataset.modeId === 'mihomo');
            if (defaultOpt) {
                defaultOpt.classList.add('selected');
                selectedModeLabel.innerText = defaultOpt.innerText;
            }

            // 触发器点击事件
            modeTrigger.addEventListener('click', (e) => {
                e.stopPropagation();
                modeDropdown.classList.toggle('open');
            });

            // 点击外部关闭
            document.addEventListener('click', (e) => {
                if (!modeTrigger.contains(e.target) && !modeDropdown.contains(e.target)) {
                    modeDropdown.classList.remove('open');
                }
            });

            // 预构建所有面板
            for (const [modeId, meta] of Object.entries(MODES_META)) {
                const panel = buildModePanel(modeId, meta);
                panelsContainer.appendChild(panel);
            }

            function setActiveMode(modeId) {
                currentMode = modeId;
                document.querySelectorAll('.mode-panel').forEach(panel => {
                    panel.classList.toggle('active', panel.id === \`panel-\${modeId}\`);
                });
                updateResultAndQR('');
            }

            setActiveMode('mihomo');
        }

        initApp();
    </script>
</body>

</html>
    `;
}
