export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const apiKey = config.apiKey
  const body = await readBody(event)

  if (!body.idea) {
    throw createError({ statusCode: 400, message: 'Idea is required' })
  }

/* const score = Math.floor(Math.random() * 11) //testing the client logic while the api is not working
  return {
    score: score,
    analysis: "Mocked analysis: functionality test successful."
  }
  
*/
  try {
    const response = await $fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: "system",
            content: "Evaluate the credibility of the business idea provided by the user. Return ONLY a single integer number from 0 to 10 representing the viability score. Do not provide explanation."
          },
          {
            role: "user",
            content: body.idea
          }
        ],
        temperature: 0.7
      }
    })
    //console.log('OpenAI:', JSON.stringify(response, null, 2))
    const content = response.choices[0].message.content.trim()
    const score = parseInt(content)
    if (isNaN(score)) {
      throw new Error('ai did not return a valid number')
    }
    return {
      score: score
    }
    
  } catch (error: any) {
    console.error('OpenAI Error:', error)
    throw createError({ 
      statusCode: 500, 
      message: 'Failed to evaluate idea' 
    })
  }
})