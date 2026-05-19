export interface EmailGeneration {
  versions: {
    subject: string;
    body: string;
  }[];
  subjectLines: string[];
}

export async function generateEmails(
  product: string,
  targetCustomer: string,
  tone: string
): Promise<EmailGeneration> {
  const prompt = `你是一个专业的B2B冷邮件撰写专家。根据以下信息生成3个不同版本的冷邮件：

产品描述：${product}
目标客户：${targetCustomer}
邮件语气：${tone}

请按以下JSON格式返回，不要添加任何其他文字：
{
  "versions": [
    {"subject": "主题行1", "body": "邮件正文1"},
    {"subject": "主题行2", "body": "邮件正文2"},
    {"subject": "主题行3", "body": "邮件正文3"}
  ],
  "subjectLines": ["备选主题行1", "备选主题行2", "备选主题行3", "备选主题行4", "备选主题行5"]
}

要求：
1. 每个版本风格不同（直接型、故事型、价值型）
2. 邮件正文简洁有力，不超过150词
3. 包含明确的行动号召(CTA)
4. 主题行要吸引眼球，提高打开率
5. 备选主题行提供3-5个不同风格的选择`;

  const response = await fetch('https://api.siliconflow.cn/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.SILICONFLOW_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'deepseek-ai/DeepSeek-V3',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 2000,
    }),
  });

  if (!response.ok) {
    throw new Error(`SiliconFlow API error: ${response.status}`);
  }

  const data = await response.json();
  const content = data.choices[0].message.content;

  // Extract JSON from response (handle markdown code blocks)
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('Failed to parse AI response');
  }

  return JSON.parse(jsonMatch[0]) as EmailGeneration;
}
