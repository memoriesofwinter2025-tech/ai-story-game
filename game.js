// 初始剧情
let story = {
    currentScene: "start",
    scenes: {
        start: {
            text: "你醒来时发现自己身处一个神秘的森林。周围的树木散发着微弱的荧光，空气中弥漫着奇幻的气息。",
            choices: [
                { text: "向森林深处走去", next: "forest_deep" },
                { text: "寻找出路", next: "find_exit" }
            ],
            imagePrompt: "A mysterious glowing forest at night, dark fantasy style, cinematic lighting, 4K"
        },
        forest_deep: {
            text: "你在森林深处遇到了一只会说话的狐狸。它的眼睛在黑暗中闪烁着智慧的光芒，问你是否需要帮助。",
            choices: [
                { text: "接受狐狸的帮助", next: "accept_help" },
                { text: "拒绝并继续前行", next: "refuse_help" }
            ],
            imagePrompt: "A wise talking fox in a glowing forest, Ghibli style, soft lighting, 4K"
        }
    }
};

// 加载场景
function loadScene(sceneKey) {
    const scene = story.scenes[sceneKey];
    document.getElementById("story-text").innerText = scene.text;
    const choicesDiv = document.getElementById("choices");
    choicesDiv.innerHTML = "";

    scene.choices.forEach(choice => {
        const button = document.createElement("div");
        button.className = "choice";
        button.innerText = choice.text;
        button.onclick = () => {
            story.currentScene = choice.next;
            loadScene(choice.next);
            // 生成下一场景的文本和图片
            generateNextScene(choice.next);
        };
        choicesDiv.appendChild(button);
    });

    // 生成场景图片
    generateImage(scene.imagePrompt);
}

// 生成图片（使用 Pollinations API）
async function generateImage(prompt) {
    const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}`;
    document.getElementById("scene-image").src = imageUrl;
    
    // 下载图片到 assets 文件夹（开发调试用）
    try {
        const response = await axios.get(imageUrl, { responseType: 'blob' });
        const blob = new Blob([response.data]);
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `scene_${Date.now()}.png`;
        link.click();
        console.log("图片已保存到本地（调试用）");
    } catch (error) {
        console.error("下载图片失败:", error);
    }
}

// 模拟生成下一场景（使用 Gemini API 或其他生成模型）
async function generateNextScene(nextSceneKey) {
    const currentScene = story.scenes[story.currentScene];
    const prompt = `
        根据以下游戏场景和玩家选择，生成下一个场景的文本、选项和图片描述：
        当前场景：${currentScene.text}
        玩家选择：${event.target.innerText}
        要求：
        1. 剧情要有逻辑性和趣味性，符合奇幻风格。
        2. 提供 1-2 个选项，让玩家继续选择。
        3. 提供一个简洁的图片描述（英文），用于生成场景图。
        4. 返回 JSON 格式：
        {
            "text": "场景文本",
            "choices": [{"text": "选项1", "next": "scene_key"}],
            "imagePrompt": "图片描述（英文）"
        }
    `;
    
    // 模拟 API 调用（实际使用时替换为真实 API）
    console.log("生成下一场景的 Prompt:", prompt);
    
    // 模拟响应（开发调试用）
    const simulatedResponse = {
        text: "狐狸将你带到了一个隐藏的村庄，村民们正在举行神秘的仪式。",
        choices: [
            { text: "加入仪式", next: "join_ritual" },
            { text: "询问村民关于森林的秘密", next: "ask_villagers" }
        ],
        imagePrompt: "A hidden fantasy village with glowing lanterns, villagers in robes, dark fantasy style"
    };
    
    // 动态添加新场景
    story.scenes[nextSceneKey] = simulatedResponse;
    console.log("新场景已生成:", story.scenes[nextSceneKey]);
}

// 初始化游戏
loadScene(story.currentScene);