/* === Constants and State === */
const sections = [
  { id: 1,  title: "Welcome!",                quiz: false },
  { id: 2,  title: "What is AI?",             quiz: true  },
  { id: 3,  title: "AI Through Time",         quiz: true  },
  { id: 4,  title: "How AI Learns",           quiz: true  },
  { id: 5,  title: "Talking to AI: Prompting",quiz: true  },
  { id: 6,  title: "Your AI Toolkit",         quiz: true  },
  { id: 7,  title: "AI in Your Workflow",     quiz: true  },
  { id: 8,  title: "Benefits & Challenges",   quiz: true  },
  { id: 9,  title: "Playing it Safe",         quiz: true  },
  { id: 10, title: "Getting Started",         quiz: true  },
  { id: 11, title: "Wrap‑up & Next Steps",    quiz: false },
  { id: "final-quiz", title: "Final Quiz",    quiz: false },
  { id: "certificate", title: "Certificate",  quiz: false },
];

/* Audio URLs */
const sectionAudio = { // Audio URLs remain the same
  1: "https://pouch.jumpshare.com/preview/o5zZa5de-dg9GkrKxs711OjFjqItzN2qqT4EAaWSySnoDUMV_L7g8Vm9ytraw5kKHIp5j72rKBk2aslETGxxTVN-NKIA9BoXQGcci4PTTDlXUMSkNxXLMFKbzKTNNAGpM_ofp4KwSx-JNCnBYYFzSm6yjbN-I2pg_cnoHs_AmgI.mp3",
  2: "https://pouch.jumpshare.com/preview/eM5Iw-w1Dj4-jyk_2wfHEAHP1JDl-QUSeL0YDsP0YIWoWLC3e-bS5DgJ7Uxp4KhSCo3tQljVX5csy3PdUAiLDjBwWt1biFZlqqC0JDUwwANdoLu9p_zv0F2wMDuJ99QpOG3Sf_MWfXVfhqLXUU_LbG6yjbN-I2pg_cnoHs_AmgI.mp3",
  3: "https://pouch.jumpshare.com/preview/XIHb9N-TOjJ4rEA-oAHkC9pSpCWtBeuf2LUP6g2kTsvY_ZvwPo-8k6NIJvYWibTwPbdAmjrEzAE7BtrylTTGVSBXBtdAlgyhbZcJHVqhuiwEet1gSMxKlL14uIC-BlsgNqzz2ePbxdYPMjMt0J4lAG6yjbN-I2pg_cnoHs_AmgI.mp3",
  4: "https://pouch.jumpshare.com/preview/NhBzQoul_1wQs7A-m5R9U5dTEjijnHI5BYMSBA0qaMBG46IulLDIyegY4ovXuOWoWMvbIOdX-kNw3dk9t_Jq4OPm9rcdiCo3J535N_J2fHEvaxFM0KJeBN_r9OUZ6p3WRPaPbRC0Ds4P7sFW5BIEPG6yjbN-I2pg_cnoHs_AmgI.mp3",
  5: "https://pouch.jumpshare.com/preview/o_8UgzA4AyRsr2dAf64NLLWCpUt42jd7A7uLDgH1dvE-Dhk5GuWKCcqOq9n4zRZp9uiH7m0sOqhE7wQkwUq8Ckxp6hTTEuW3oTbQhEjQMqeQHhgVKeVOAcz61j7r9OUUop5OmNdkHcaOqAXtlByB926yjbN-I2pg_cnoHs_AmgI.mp3",
  6: "https://pouch.jumpshare.com/preview/2CnhCeT9PGX5P-ncx5k2aOf1bipg1N32QFh-mXjXk0VqH0sPlQoqBb-4AR2-gcC2uSjD2Y-ZZ1j-FEBTRIyW2TIvgnT3hEfpr4dBEezK3vt2aF5GdIKBX-Ozzl_UgiPyeNEQm_6tZkKYrGLSIr8H526yjbN-I2pg_cnoHs_AmgI.mp3",
  7: "https://pouch.jumpshare.com/preview/8Z4eEC6FL8WauieSTFOQmuHgeNsQ55Z8Yc13fTswzHEOlP5N6syB5lSt61Nbd8rbgeJSrscUxFSRcdb_z3TTz_FUCDxY7-NuLD5JyFsftMiSc4FRHoViBZUuQr7c-Edq9LcKNDP2rGfXKQnloFcJLm6yjbN-I2pg_cnoHs_AmgI.mp3",
  8: "https://pouch.jumpshare.com/preview/zzPGtqCjmfvP8QVwKjviIAlTtPw31eEMKzuhiO18hNvszW9N5-ROEgVdFWbQmvwr8LhUB4lsUvFgCi9nnbP9G5aALEaAsMvEOjc4JEVAZWKqm-NFkUqKI6yu2bHc-bc3MRgS5YVyC4lPc5GMh9DsGG6yjbN-I2pg_cnoHs_AmgI.mp3",
  9: "https://pouch.jumpshare.com/preview/v4L5Ox74-y3ew9QyMWRE18BtGm-4zTe2NxXvBc8iOz1xsl6R2Ce6Q89TdkBvDjMiHM0Qwvz8C-6utuNOkjsxn14IlbxeMt26OWH1b7a1sbzkn7USCZ094v05zeLb4EOsJA28psViu8JcHWYLyufne26yjbN-I2pg_cnoHs_AmgI.mp3",
  10: "https://pouch.jumpshare.com/preview/zhG19FjxaXVP3UejdJhYWcAdY8uOLCyUklsZOAjJHu6ZTjRbZH7VyFviFASmsW-6NF-sA3Sn_5f3t6N3i32iAzWtb7NDU9j3BgDT54eDzcnFUpEcDNGf5YGqnJwXkuAuZF4MQwrS_363JLZvRfSnpm6yjbN-I2pg_cnoHs_AmgI.mp3",
  11: "https://pouch.jumpshare.com/preview/n1fX8klccHXg4AFinwAzCRWursnZ8t2fu2P_gmT9poOMiv1ThQZ_X0gy3HL6sYp0ICzZkRyZ74KmDxHZsdHKJZZIvnbk3GGBg-rt2Sv9XuzCf1s0YmoTj8rIjRcBM8Y4gNcJehZS4kHZavzwjMtWBG6yjbN-I2pg_cnoHs_AmgI.mp3"
};

/* Quiz data */
const quizzes = {
  2: [
    {
      q: "Which statement best describes the main goal of this training module?",
      type: 'mc',
      options: [
        "To make you an expert AI coder.",
        "To help you understand AI basics and use it safely as a teaching tool.",
        "To perfectly replicate human thought.",
        "To focus only on the history of AI development."
      ],
      answer: 1,
      feedback: [
        "Not quite. This module focuses on using AI tools, not programming them.",
        "That's right! We aim to build foundational knowledge and confidence in using AI responsibly in your teaching practice.",
        "This module focuses on practical AI tools, not the theoretical goal of perfectly replicating human thought. Current AI is more about task-specific assistance.",
        "While we touch on history, the main focus is on practical understanding and application for teachers."
      ]
    },
    {
      q: "True or False: The AI discussed in this module (like chatbots or image generators) is considered 'Narrow AI', meaning it's designed for specific tasks.",
      type: 'tf',
      answer: true,
      correctFeedback: "Spot on! Most AI tools we use today are Narrow AI, excelling at specific functions like language translation or generating text, rather than possessing general human-like intelligence.",
      incorrectFeedback: "Good try! Actually, the AI tools commonly available today are 'Narrow AI'. They are very good at specific tasks but don't have the broad, adaptable intelligence of humans (which would be 'General AI')."
    }
  ],
  3: [
    {
      q: "Which of these is an example of AI you might use daily?",
      type: 'mc',
      options: [
        "A standard calculator.",
        "A streaming service movie recommendation.",
        "A light switch.",
        "A printed map."
      ],
      answer: 1,
      feedback: [
        "Not quite. A standard calculator performs predefined operations without learning.",
        "Exactly! Recommendation systems use AI to learn your preferences and suggest relevant content.",
        "A simple light switch is manually operated.",
        "A printed map is static information."
      ]
    },
    {
      q: "Select the option that places these AI milestones in the correct chronological order (earliest to most recent):",
      type: 'ordering_mc',
      options: [
        "A) Generative Boom -> Rise of Machine Learning -> Foundational Ideas",
        "B) Foundational Ideas -> Rise of Machine Learning -> Generative Boom",
        "C) Rise of Machine Learning -> Foundational Ideas -> Generative Boom",
        "D) Generative Boom -> Foundational Ideas -> Rise of Machine Learning"
      ],
      answer: 1,
      feedback: [
        "Not quite. Think about which concepts had to come first before machine learning could take off.",
        "Correct! The foundational concepts came first (1950s), followed by the development of machine learning (80s-00s), and then the recent boom in powerful generative models (2010s+).",
        "Almost! Machine learning built upon the earlier foundational ideas.",
        "Consider the timeline – generative models are the most recent major development shown here."
      ]
    }
  ],
   4: [ { q: "Match the AI learning concepts (from our baking analogy) to their descriptions:", type: 'matching', items: [ { id: 'data', term: "Data" }, { id: 'algo', term: "Algorithm" }, { id: 'learn', term: "Learning Process" } ], options: [ { id: 'desc1', text: "The step-by-step instructions or 'recipe' the AI follows." }, { id: 'desc2', text: "The vast amount of information or 'ingredients' the AI trains on." }, { id: 'desc3', text: "Refining the results based on examples, like adjusting seasoning in a recipe." } ], answer: { 'data': 'desc2', 'algo': 'desc1', 'learn': 'desc3' }, correctFeedback: "Excellent! You've correctly matched the core concepts of AI learning.", incorrectFeedback: "Not quite right. Review the analogies: Data is the ingredients, Algorithms are the recipe, and Learning is the process of refining based on tasting/examples." }, { q: "What is the core process AI uses to 'learn' from data?", type: 'mc', options: ["Developing emotions", "Memorizing every single data point", "Recognizing patterns and relationships", "Randomly guessing answers"], answer: 2, feedback: ["Current AI doesn't develop emotions or consciousness; its learning is mathematical.", "While AI processes vast data, its strength lies in identifying patterns, not just memorizing individual pieces of information.", "You got it! AI learning is essentially sophisticated pattern recognition – finding connections and correlations within the data it's trained on.", "AI uses algorithms, not random guessing, to find patterns and make predictions based on data."] }, { q: "True or False: An AI needs to 'understand' a concept like a human does to generate text about it.", type: 'tf', answer: false, correctFeedback: "That's right! AI operates on patterns in language and data. It can generate grammatically correct and contextually relevant text about topics without having true comprehension or consciousness.", incorrectFeedback: "That's a common misconception! AI excels at pattern matching in language. It can write about photosynthesis without actually 'understanding' biology like a person does." } ],
  5: [ { q: "To get the most helpful response from an AI assistant for a classroom task, your prompt should ideally be:", type: 'mc', options: ["Very short and open-ended", "Filled with complex academic jargon", "Clear, specific, and provide context (like grade level)", "Written entirely in questions"], answer: 2, feedback: ["While sometimes useful for broad brainstorming, very short prompts often lead to generic results for specific tasks.", "Using overly complex language might confuse the AI or lead to outputs that aren't practical. Clear, simple language is usually better.", "Precisely! Providing clarity (what you want), specificity (details), and context (audience, subject) helps the AI generate a much more targeted and useful response.", "While questions can be part of a prompt, commands (like 'Generate,' 'List,' 'Explain') combined with context are often more effective."] }, { q: "If your first prompt doesn't give the desired result, what's a good next step?", type: 'mc', options: ["Assume the AI tool is broken", "Give up on using AI for that task", "Rephrase the prompt, adding more detail or changing the perspective", "Ask the AI why it gave a bad answer"], answer: 2, feedback: ["It's unlikely the tool is completely broken. The issue is often the prompt itself.", "Don't give up easily! Prompting is often an iterative process.", "Yes, that's the way! Refining your prompt is key. Try adding more context, being more specific, asking for a different format, or even telling the AI what *not* to include.", "While you can sometimes ask for clarification, actively refining your own prompt based on the output is usually more productive."] }, { q: "Telling the AI to respond 'as a helpful librarian' or 'in the style of a pirate' is an example of specifying what element in a prompt?", type: 'mc', options: ["The Goal", "The Format", "The Persona or Role", "The Data Source"], answer: 2, feedback: ["The goal is *what* you want (e.g., list books), not *how* the AI should act.", "The format is the structure (e.g., bullet points), not the AI's character.", "Spot on! Assigning a persona or role can influence the tone, style, and sometimes even the content of the AI's response.", "The data source is what the AI learned from, not an instruction you typically give in a prompt."] } ],
  6: [ { q: "A teacher uses an AI tool to generate different opening hooks for a lesson on fractions. Which category does this primarily fall into?", type: 'mc', options: ["Accessibility Tools", "Assessment & Feedback Aids", "Content Creation Aids", "Idea Generation / Brainstorming"], answer: 3, feedback: ["Accessibility tools usually focus on overcoming barriers like reading difficulties.", "Assessment tools help evaluate learning, not typically generate initial lesson ideas.", "While it involves creating content, the main purpose here is exploring different creative starting points.", "Correct! Using AI to come up with various creative options or starting points for a lesson is a great example of idea generation."] }, { q: "Why is it important to check the privacy policy of an AI tool before using it for school-related tasks?", type: 'mc', options: ["To see if it offers discounts for teachers", "To understand how it handles user data and ensure compliance with school policies", "To find out who programmed the AI", "To learn advanced prompting techniques"], answer: 1, feedback: ["Discounts are nice, but privacy is the critical factor here.", "Absolutely. Privacy policies explain how your data (and potentially student data, if applicable and allowed) is collected, used, and protected. This is crucial for meeting ethical and legal obligations.", "The programmers' identities aren't usually relevant to safe use.", "Prompting techniques are learned through practice and resources, not typically detailed in privacy policies."] }, { q: "True or False: All AI tools within the same category (e.g., Content Creation) work exactly the same way and produce identical results.", type: 'tf', answer: false, correctFeedback: "Indeed! Different AI models and tools, even within the same category, have unique strengths, weaknesses, training data, and interfaces. Results can vary significantly.", incorrectFeedback: "Not quite. Even tools designed for similar tasks can differ greatly in their capabilities, the quality of their output, and how they respond to prompts. It's often worth trying a couple of options if one isn't working well." } ],
  7: [ { q: "A teacher asks an AI: 'Create a simple social story for a 1st grader about sharing toys, focusing on taking turns.' This is a practical example of using AI for:", type: 'mc', options: ["Generating Math Problems", "Creating Specific Learning Supports", "Summarizing Research Articles", "Translating Parent Letters"], answer: 1, feedback: ["This prompt is focused on social-emotional learning, not math.", "Correct! This demonstrates using AI to create tailored content that supports specific student needs, like social skills development.", "Summarization involves condensing existing text, not creating a new story.", "Translation changes language; this prompt asks for original content creation."] }, { q: "What is the crucial step a teacher MUST take after using AI to draft differentiated questions or a newsletter snippet?", type: 'mc', options: ["Immediately delete the AI output", "Send it directly to students or parents", "Carefully review, edit, and personalize the content", "Ask the AI to grade its own work"], answer: 2, feedback: ["Deleting it might be wasteful if it's a useful starting point.", "Sending unreviewed AI content is risky due to potential errors, biases, or inappropriate tone.", "That's the key! Human oversight is essential. Always review for accuracy, appropriateness, tone, and add your own professional touch before using or sharing AI-generated content.", "AI cannot reliably evaluate the pedagogical appropriateness or contextual nuances of its own work."] }, { q: "True or False: The examples in this section show that AI can completely replace the need for teacher planning and material creation.", type: 'tf', answer: false, correctFeedback: "You've got it! The examples illustrate how AI can <em>assist</em> with these tasks, acting as a helpful starting point or efficiency tool, but the teacher's expertise in refining, selecting, and implementing materials remains crucial.", incorrectFeedback: "Good try, but the examples are meant to show AI as an <em>assistant</em>. It can speed things up or provide ideas, but it doesn't replace the teacher's judgment, creativity, and understanding of their students." } ],
  8: [ { q: "Saving time on drafting initial lesson ideas allows teachers more time for direct student interaction. This highlights which aspect of AI use?", type: 'mc', options: ["A potential challenge (Over-Reliance)", "A potential benefit (Efficiency Boost)", "A data privacy risk", "An example of AI bias"], answer: 1, feedback: ["While over-reliance is a challenge, this specific outcome describes a positive aspect.", "Correct! One of the key potential benefits of AI is increasing efficiency in certain tasks, freeing up educators for other important activities like working directly with students.", "Data privacy is a separate, important concern, but not what this scenario describes.", "AI bias relates to unfair or stereotypical outputs, not time savings."] }, { q: "An AI tool trained primarily on historical texts might generate content reflecting outdated social norms. This is an example of which challenge?", type: 'mc', options: ["Accuracy Issues ('Hallucinations')", "Potential Bias", "Digital Divide", "Over-Reliance"], answer: 1, feedback: ["Hallucinations are typically factually incorrect or nonsensical outputs, whereas this relates to skewed perspectives.", "Exactly! AI learns from its training data, and if that data contains historical or societal biases, the AI's output may perpetuate them. This requires careful review by the educator.", "The digital divide relates to unequal access to technology, not the content itself.", "Over-reliance is about depending too much on the tool, not the nature of its potentially flawed output."] }, { q: "True or False: Because AI can generate information quickly, teachers no longer need to focus on developing students' critical thinking skills.", type: 'tf', answer: false, correctFeedback: "Spot on! If anything, the presence of AI makes critical thinking *more* important. Students (and teachers) need to evaluate AI-generated information, identify potential issues, and think critically about its use.", incorrectFeedback: "Not at all! The ease with which AI generates information makes critical evaluation skills even more vital. We need to teach students (and practice ourselves) how to question, verify, and thoughtfully use AI outputs." } ],
  9: [ { q: "Which action is essential for protecting student privacy when using a public AI tool for brainstorming classroom scenarios?", type: 'mc', options: ["Using student first names only", "Describing students using anonymized details (e.g., 'a student struggling with fractions')", "Getting verbal permission from the student", "Using the tool only outside of school hours"], answer: 1, feedback: ["Even first names can be identifying, especially in context. Avoid using real names.", "Correct! Using general, anonymized descriptions allows you to get help with scenarios without compromising the privacy of specific students.", "Verbal permission isn't sufficient for data privacy regulations like FERPA/COPPA, especially with third-party tools. Stick to anonymization and approved tools.", "The time of day doesn't change the privacy implications of the data entered."] }, { q: "Why is 'Human Oversight' a key principle for responsible AI use by teachers?", type: 'mc', options: ["Because AI tools often crash", "Because teachers need to check if the AI followed the prompt exactly", "Because AI lacks real-world understanding, common sense, and ethical judgment", "Because schools require teachers to log all AI use"], answer: 2, feedback: ["While tools can have glitches, the core reason for oversight is about content quality and ethics.", "Following the prompt is only part of it. The output still needs evaluation for accuracy, bias, and appropriateness.", "That's it! AI operates based on patterns, not true understanding. Teachers must apply their professional judgment, contextual knowledge, and ethical considerations to review and approve AI outputs.", "Logging AI use might be a local policy, but the fundamental reason for oversight is ensuring the quality and safety of what the AI produces."] }, { q: "True or False: It is generally acceptable to copy educational materials directly from an AI tool and present them as your own original work.", type: 'tf', answer: false, correctFeedback: "Right! Transparency and academic integrity are important. While AI can assist, educators should acknowledge its use appropriately and avoid presenting AI-generated text verbatim as their own creation.", incorrectFeedback: "Not quite. Ethical use includes being transparent about using AI assistance. Presenting significant AI-generated content as entirely your own work can be misleading or violate academic integrity principles." } ],
  10: [ { q: "According to this section, what is a good 'first step' task for a teacher new to using AI?", type: 'mc', options: ["Automating all parent communication", "Generating ideas for a classroom bulletin board", "Using AI to write substitute teacher plans", "Creating final exam questions"], answer: 1, feedback: ["Automating all communication is too high-stakes for a first step.", "Correct! Brainstorming creative, low-stakes ideas like this is a perfect way to experiment safely and see what the AI can do.", "Substitute plans are critical and require careful, verified information – not ideal for a first try.", "Final exam questions are high-stakes and require careful validation, making them unsuitable for initial experimentation."] }, { q: "What does it mean to focus on 'augmentation' rather than 'replacement' when using AI?", type: 'mc', options: ["Using AI only for tasks students dislike", "Letting AI do most of the teaching", "Using AI as a tool to help and enhance your teaching, not take it over", "Replacing textbooks with AI chatbots"], answer: 2, feedback: ["The focus should be on tasks where AI can genuinely assist the teacher, regardless of student preference.", "Augmentation means AI supports the teacher, who remains central to the teaching process.", "Precisely! Augmentation emphasizes using AI as a helpful assistant to improve efficiency or spark ideas, while the teacher retains control and the core human elements of teaching.", "Replacing resources is a different consideration; augmentation is about how the teacher uses the tool in their practice."] }, { q: "True or False: Once you find one AI tool you like, you should stop looking for new resources or learning about AI.", type: 'tf', answer: false, correctFeedback: "You've got it! AI is constantly changing. Staying curious, exploring new tools (when appropriate and policy-aligned), and engaging in ongoing professional learning is important for using AI effectively long-term.", incorrectFeedback: "Good try, but because AI evolves so quickly, it's beneficial to stay informed about new developments, tools, and best practices through reliable resources and collaboration with colleagues." } ],
  'final-quiz': [ { q: "What does AI primarily learn from?", type: 'mc', options: ["Magic", "Data", "Electricity", "Books"], answer: 1, feedback: ["While AI can seem magical, it's based on computation.", "Correct! AI systems learn by analyzing patterns and relationships within large datasets.", "Electricity powers the hardware, but the learning comes from the information processed.", "Books can be a source of data, but AI learns from the processed data itself, in various forms."], sectionLink: 4 }, { q: "True or False: For best results, AI prompts should always be as short and vague as possible.", type: 'tf', answer: false, correctFeedback: "Exactly! Effective prompts are typically clear, specific, and provide context (like audience or goal) to help the AI generate a relevant and useful response.", incorrectFeedback: "Not quite. While brevity can be good, vagueness usually leads to generic or unhelpful AI outputs. Specificity and context are key for getting good results.", sectionLink: 5 }, { q: "Which of these is a commonly cited potential *benefit* of using AI tools for teachers?", type: 'mc', options: ["Guaranteed error-free content", "Increased efficiency in certain tasks", "Reduced need for classroom management", "Perfect understanding of student emotions"], answer: 1, feedback: ["AI can make mistakes ('hallucinate'), so assuming error-free content is risky.", "That's right! AI can help automate or speed up tasks like drafting materials or brainstorming, potentially saving teachers time.", "Classroom management relies heavily on human interaction and is not something AI currently addresses effectively.", "AI does not understand emotions; interpreting and responding to student emotions requires human empathy and expertise."], sectionLink: 8 }, { q: "What is the single most important safety precaution when considering using a public AI tool that might involve student topics?", type: 'mc', options: ["Ensure the AI has a friendly interface", "Strictly avoid inputting any personally identifiable student information (PII)", "Use the tool only during planning periods", "Check if the AI cites its sources"], answer: 1, feedback: ["A friendly interface doesn't guarantee data security.", "Absolutely critical! Protecting student privacy by never entering PII (names, specific details, etc.) into non-approved public tools is the paramount safety rule.", "Time of use doesn't affect data privacy risks.", "Source citation is a feature of some AI, but data privacy is a more fundamental safety concern."], sectionLink: 9 }, { q: "An AI tool that helps draft lesson plan ideas or worksheet questions falls into which general category?", type: 'mc', options: ["AI Grading Assistant", "Content Creation Tool", "Student Tutoring Platform", "Data Analytics Dashboard"], answer: 1, feedback: ["While related, AI grading focuses on evaluation, not initial drafting.", "Correct! Tools designed to help generate text like lesson plans, emails, or questions are considered content creation aids.", "Tutoring platforms are typically student-facing.", "Data analytics tools focus on interpreting existing data, not generating new content."], sectionLink: 6 }, { q: "A teacher uses AI to generate 3 different versions of instructions for an art project, tailored for different reading levels. This is a good example of using AI to support:", type: 'mc', options: ["Classroom discipline", "Student assessment", "Differentiation", "Technology repair"], answer: 2, feedback: ["This task isn't directly related to classroom discipline.", "While the instructions relate to an activity, the core function here isn't assessment.", "Spot on! Creating varied materials to meet diverse learner needs (like different reading levels) is a key aspect of differentiation, and AI can assist with this.", "This is about content creation, not hardware repair."], sectionLink: 7 }, { q: "Relying solely on AI-generated information without cross-referencing or using professional judgment is risky primarily due to the potential for:", type: 'mc', options: ["The AI becoming too popular", "High subscription costs", "Inaccuracies or biases in the AI's output", "The AI running out of ideas"], answer: 2, feedback: ["Popularity isn't the main risk.", "Cost is a practical factor, but the quality of information is a more fundamental risk.", "Correct! AI can generate incorrect information ('hallucinate') or reflect biases from its training data. Critical evaluation and fact-checking are essential.", "While outputs can sometimes be repetitive, the main risk is the *quality* of the ideas, not the quantity."] , sectionLink: 8 }, { q: "What is a recommended 'low-stakes' way for a teacher to begin experimenting with AI?", type: 'mc', options: ["Using AI to write personalized feedback on student essays", "Asking AI to generate fun facts or jokes related to a lesson topic", "Having AI create and score a major unit test", "Letting AI respond to parent emails automatically"], answer: 1, feedback: ["Personalized feedback is high-stakes and requires significant teacher nuance.", "Great idea! Tasks like generating fun facts, brainstorming, or creating simple, non-critical content are perfect low-stakes ways to start exploring AI.", "Creating and scoring high-stakes tests requires careful validation and is not a good starting point.", "Automating parent emails is risky due to the need for personalization, empathy, and accuracy."] , sectionLink: 10 }, { q: "True or False: The basic ideas behind Artificial Intelligence have only existed since the invention of the internet.", type: 'tf', answer: false, correctFeedback: "Correct! Foundational concepts about machines performing tasks requiring intelligence date back to the mid-20th century, well before the widespread adoption of the internet.", incorrectFeedback: "Not quite. While the internet and related technologies have accelerated AI development, the core ideas and early research began much earlier, around the 1950s.", sectionLink: 3 }, { q: "The principle of 'Human Oversight' primarily means that:", type: 'mc', options: ["Humans should watch AI while it works", "AI should supervise human teachers", "Teachers must always review, evaluate, and approve AI outputs before use", "Only humans are allowed to use AI tools"], answer: 2, feedback: ["Watching the AI isn't the core meaning; it's about the review process.", "This reverses the intended relationship; the human remains in charge.", "Precisely! This is the essence of human oversight in this context – the educator applies their professional judgment to the AI's suggestions or creations.", "This is incorrect; the principle guides *how* humans should interact with and manage AI tools."] , sectionLink: 9 } ]
};


/* State */
let state = {
  currentSectionId : 1,
  quizResults      : {},
  finalQuizCompleted: false,
  userName         : '',
  timelineInteractedS3: false, // From previous update
  highestSectionUnlocked: 1 // NEW: Start with section 1 unlocked
};

/* === Cached DOM nodes === */
const sidebar             = document.getElementById('sidebar');
const openSidebarBtn      = document.getElementById('openSidebarBtn');
const closeSidebarBtn     = document.getElementById('closeSidebarBtn');
const contentArea         = document.getElementById('contentArea');
const sectionTitle        = document.getElementById('sectionTitle');
const prevBtn             = document.getElementById('prevBtn');
const nextBtn             = document.getElementById('nextBtn');
const quizModal           = document.getElementById('quizModal');
const quizTitle           = document.getElementById('quizTitle');
const quizContent         = document.getElementById('quizContent');
const submitQuizBtn       = document.getElementById('submitQuizBtn');
const resetQuizBtn        = document.getElementById('resetQuizBtn');
const closeQuizBtn        = document.getElementById('closeQuizBtn');
const resetModuleBtn      = document.getElementById('resetModuleBtn');
const sectionAudioPlayer  = document.getElementById('sectionAudioPlayer');

/* === NEW: Variables for Swipe Gesture === */
let touchStartX = 0;
let touchEndX = 0;
const swipeThreshold = 50; // Minimum horizontal distance (pixels) to be considered a swipe
function getNumericSectionId(sectionId) {
    const order = sections.map(s => String(s.id));
    return order.indexOf(String(sectionId));     // 0‑based, -1 if not found
}
/* === All functions from the original <script> block go here === */
function renderSection(sectionId) {
  const section = sections.find(s => s.id == sectionId);
  if (!section) {
    console.error("Section not found:", sectionId);
    contentArea.innerHTML = `<div class="bg-white p-6 rounded-lg shadow"><p class="text-red-600">Error: Content could not be loaded.</p></div>`;
    sectionTitle.textContent = 'Error';
    return;
  }
  sectionTitle.textContent = section.title;

  let audioButtonHtml = '';
  if (sectionAudio[section.id]) {
      audioButtonHtml = `<button id="audioPlayerBtn" class="audio-player-btn no-print" title="Listen to section audio"><i class="fas fa-play mr-1"></i> Listen</button>`;
  }

  let contentHtml = `<div class="bg-white p-8 rounded-lg shadow space-y-6">`;
  contentHtml += audioButtonHtml;
  contentHtml += `<h3 class="text-2xl font-semibold mb-4 text-sky-700">${section.title}</h3>`;
  contentHtml += `<div class="readable-content space-y-4">`;
  
  let tooltip = document.getElementById('tooltip');
  if (!tooltip) {
    tooltip = document.createElement('div');
    tooltip.id = 'tooltip';
    tooltip.setAttribute('role', 'dialog');      // a11y: announce as pop‑up
    tooltip.setAttribute('aria-hidden', 'true'); // hidden until opened
    document.body.appendChild(tooltip);
  }

  // --- State -------------------------------------------------------------
  let openBtn = null; // the .key‑term currently showing the tooltip

  // 2. Helpers ------------------------------------------------------------
  function positionTooltip(btn) {
    const rect = btn.getBoundingClientRect();
    const tipRect = tooltip.getBoundingClientRect();
    const gap = 8; // px between the button and the balloon

    // Prefer above the term, otherwise below
    let top = rect.top - gap - tipRect.height;
    if (top < 0) {
      top = rect.bottom + gap;
    }
    const left = rect.left + rect.width / 2;
    tooltip.style.top = `${top + window.scrollY}px`;
    tooltip.style.left = `${left + window.scrollX}px`;
    tooltip.style.transform = 'translate(-50%, 0)';
  }

  function openTooltip(btn) {
    openBtn = btn;
    tooltip.textContent = btn.dataset.tooltip || btn.getAttribute('title') || '';
    tooltip.setAttribute('data-show', ''); // CSS toggles visibility
    tooltip.removeAttribute('aria-hidden');
    positionTooltip(btn);
  }

  function closeTooltip() {
    if (!openBtn) return;
    tooltip.removeAttribute('data-show');
    tooltip.setAttribute('aria-hidden', 'true');
    openBtn = null;
  }

  // 3. Progressive enhancement: turn any <span class="key-term"> into an accessible <button>
  function enhanceKeyTerms(root = document) {
    root.querySelectorAll('.key-term').forEach(el => {
      // already upgraded
      if (el.tagName === 'BUTTON') return;

	const definition =
		el.dataset.definition       // ① recognise data-definition
			|| el.dataset.tooltip
			|| el.getAttribute('title');
    const btn = document.createElement('button');
    btn.className = 'key-term';
    if (definition) btn.dataset.tooltip = definition;  // ② always copy
    btn.setAttribute('aria-haspopup', 'dialog');
    btn.innerHTML = el.innerHTML; // keep inner content intact
    el.replaceWith(btn);
  });
  }

  // 4. Global listeners ---------------------------------------------------
  document.addEventListener('click', e => {
    const btn = e.target.closest('.key-term');
    if (!btn) {
      closeTooltip();
      return;
    }
    // toggle behaviour: open or close the same term
    if (openBtn === btn) {
      closeTooltip();
    } else {
      openTooltip(btn);
    }
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeTooltip();
  });

  // 5. Initialise once DOM is ready, then observe content swaps ----------
  document.addEventListener('DOMContentLoaded', () => {
    enhanceKeyTerms();

    // Whenever the training module swaps out #contentArea, upgrade new terms
    const target = document.getElementById('contentArea');
    if (!target) return;
    const mo = new MutationObserver(() => enhanceKeyTerms(target));
    mo.observe(target, { childList: true, subtree: true });
  });

  switch (String(section.id)) {
    case '1':
      contentHtml += `
        <p class="text-lg">Welcome, educators, to your introduction to Artificial Intelligence in the classroom!</p>
        <p>Feeling curious, excited, or maybe even a little apprehensive about AI? That's perfectly normal! This module is designed to demystify AI, explore its potential as a helpful tool for elementary teachers, and empower you to use it effectively and ethically.</p>
        <p>We'll journey through the basics, look at practical applications, and discuss how to navigate this technology safely.</p>
        <p><strong>What to expect in this module:</strong></p>
        <ul class="list-disc list-inside ml-4 space-y-1 text-gray-700">
          <li>Simple explanations of core AI ideas (no complex code!).</li>
          <li>Real-world examples relevant to your K-5/K-6 workflow.</li>
          <li>Quick, low-stakes quizzes to reinforce key points.</li>
          <li>A strong focus on responsible and safe practices.</li>
          <li>A final check-in and a certificate to mark your learning journey.</li>
        </ul>
        <div class="my-6 p-4 bg-sky-50 rounded-lg text-center border border-sky-200 shadow-sm">
          <img src="https://i.imgur.com/jdN5a0Z.png" alt="Teacher exploring AI concepts" class="mx-auto rounded shadow max-w-full h-auto mb-2" style="max-height: 300px;" onerror="this.style.display='none'; this.onerror=null;">
          <p class="text-sm text-sky-600 font-medium mt-2">Let's explore the potential of AI together!</p>
        </div>
        <div class="text-center mt-8">
                 <button id="beginModuleBtn" class="px-8 py-3 text-lg text-white bg-green-600 rounded-md hover:bg-green-700 shadow-md transition duration-150 ease-in-out"> Begin Module <i class="fas fa-arrow-right ml-2"></i> </button>
        </div>`;
      break;
    case '2':
      contentHtml += `
        <p>Think of AI as creating computer systems that can perform tasks typically requiring human intelligence. This might make you wonder: how is that different from the regular software we use every day? And if AI can mimic human intelligence, does that mean all AI is the same?</p>
        <p>Let's clarify these points. A helpful starting analogy is to imagine a <span class="key-term" role="button" tabindex="0" data-definition="A system that uses learned patterns (e.g. NLP) to help with specific tasks, such as answering questions or drafting text.">smart&nbsp;assistant</span> that learns from countless examples to help with specific jobs. It's not about conscious robots; it's about specialized tools that operate differently from traditional programs.</p>

        <div class="reveal-container mt-4">
          <details>
            <summary>So, what IS the difference: AI vs. Regular Software? <i class="fas fa-info-circle ml-1 text-sky-500 text-xs"></i></summary>
            <div class="reveal-content">Traditional software follows explicit, pre-programmed rules. If X happens, do Y. AI, especially machine learning (which we'll explore more soon!), learns patterns from vast amounts of data to make predictions or decisions. While it operates on programmed algorithms, its behavior is refined by the data it's trained on, allowing it to handle new situations it wasn't explicitly programmed for in the same way traditional software is.</div>
          </details>
        </div>

        <p class="mt-4">This leads to another important distinction. The AI you'll interact with most often, and the primary focus of this module, is known as <span class="key-term" data-definition="AI models designed for one task (e.g. image captioning).">Narrow AI</span>. This means it's designed for specific tasks, like translating languages, recommending movies, or generating text based on your prompts. It excels in its particular domain but doesn't possess broad, human-like general intelligence. The concept of <span class="key-term" role="button" tabindex="0" data-definition="A not-yet‑achieved form of AI that would match or exceed human intelligence across **any** domain or task.">Artificial&nbsp;General&nbsp;Intelligence&nbsp;(AGI)</span> is still largely theoretical and not what we're working with in these practical tools.</p>`;
        contentHtml += `<div class="mt-6 p-4 bg-indigo-50 rounded-lg border border-indigo-200"><h4 class="font-semibold text-indigo-700 mb-2">🤔 Think About It:</h4><p class="text-sm text-indigo-600">How does understanding the distinction between Narrow AI and AGI change your perception of current AI tools?</p></div>`;
      break;
    case '3':
      contentHtml += `
        <p>While AI feels very current, its roots go back further than you might think! Understanding this brief history helps appreciate how we got here.</p>
        <p><strong>A Quick Journey Through Time:</strong></p>
        <div id="interactive-timeline-placeholder" class="my-6">
        </div>
		<p id="section-3-unlock" class="text-center text-gray-600 italic mt-4">
			Please click on an era …
		</p>

        <p class="mt-6">The pace of change in AI is rapid, making continuous learning and adaptation important for everyone!</p>`;
      break;
    case '4':
      contentHtml += `
        <p>So, how does AI *actually* learn? It's less like human understanding and more like incredibly sophisticated <span class="key-term">pattern recognition</span>.</p>
        <p><strong>Let's revisit our baking analogy with interactive definitions:</strong></p>
        <div class="flip-card-grid">
                 <div role="button" tabindex="0" class="flip-card-container"> <div class="flip-card"> <div class="flip-card-inner"> <div class="flip-card-front"> <i class="fas fa-database text-3xl mb-2"></i> <h4>Data</h4> <p>(Hover/Tap to reveal)</p> </div> <div class="flip-card-back"> <h5>Data: The Ingredients</h5> AI systems are trained on enormous datasets (text, images, etc.). Think millions of examples. Quality & diversity matter! </div> </div> </div> </div>
                 <div role="button" tabindex="0" class="flip-card-container"> <div class="flip-card"> <div class="flip-card-inner"> <div class="flip-card-front"> <i class="fas fa-cogs text-3xl mb-2"></i> <h4>Algorithms</h4> <p>(Hover/Tap to reveal)</p> </div> <div class="flip-card-back"> <h5>Algorithms: The Recipe</h5> Complex mathematical instructions AI uses to analyze data and find patterns. Different algorithms suit different tasks. </div> </div> </div> </div>
                 <div role="button" tabindex="0" class="flip-card-container"> <div class="flip-card"> <div class="flip-card-inner"> <div class="flip-card-front"> <i class="fas fa-chart-line text-3xl mb-2"></i> <h4>Learning</h4> <p>(Hover/Tap to reveal)</p> </div> <div class="flip-card-back"> <h5>Learning: Refining</h5> AI makes predictions, checks accuracy, and adjusts internal parameters to improve performance based on patterns found in the data. </div> </div> </div> </div>
                </div>
             <p class="mt-4">Essentially, AI becomes proficient at tasks like translation, summarization, or image generation by processing countless examples and learning the statistical likelihood of certain patterns occurring together.</p>
        <div class="my-6 p-4 bg-emerald-50 rounded-lg text-center border border-emerald-200 shadow-sm">
          <img src="https://i.imgur.com/b4xTGcO.png" alt="Diagram showing Data -> Algorithm -> Pattern Recognition" class="mx-auto rounded shadow max-w-full h-auto mb-2" style="max-height: 150px;" onerror="this.style.display='none'; this.onerror=null;">
          <p class="text-sm text-emerald-600 font-medium mt-2">AI excels at finding complex patterns within vast amounts of data.</p>
        </div>
             <p class="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-4 rounded-r-lg"> <strong class="block font-semibold">Crucial Distinction:</strong> This pattern matching isn't the same as human understanding, reasoning, or consciousness. An AI can write about empathy without feeling it, or discuss scientific concepts without truly comprehending the underlying principles. It's mimicking patterns it learned from human-generated text. </p>`;
        contentHtml += `<div class="mt-6 p-4 bg-indigo-50 rounded-lg border border-indigo-200"><h4 class="font-semibold text-indigo-700 mb-2">🤔 Reflection Prompt:</h4><p class="text-sm text-indigo-600">Consider a recent task where you learned something new. How does the AI 'learning process' (Data, Algorithm, Learning) compare to your own learning experience?</p></div>`;
      break;
    case '5':
      contentHtml += `
        <p>Getting useful results from AI often depends heavily on how you ask! Your instructions, or <span class="key-term">prompts</span>, are the key to unlocking the AI's potential for your specific needs.</p>
        <p>Think of it as communicating with a very capable, very literal assistant who needs clear directions. The better your prompt, the better the result.</p>
        <p><strong>Key Ingredients for Effective Prompts (The C.R.A.F.T. Method - simplified):</strong></p>
        <div class="space-y-3 mt-2 mb-4">
          <div class="reveal-container"><details><summary><i class="fas fa-bullseye text-sky-600 mr-2 fa-fw"></i><strong>Context</strong></summary><div class="reveal-content">Clearly explain the background, who the audience is (e.g., 3rd graders, colleagues), and the overall situation or purpose. The more context the AI has, the better it can tailor its response.</div></details></div>
          <div class="reveal-container"><details><summary><i class="fas fa-user-tag text-purple-600 mr-2 fa-fw"></i><strong>Role</strong></summary><div class="reveal-content">Assign a persona for the AI to adopt. For example, ask it to respond 'as a helpful librarian,' 'as a skeptical scientist,' or 'in the style of a pirate.' This influences tone and perspective.</div></details></div>
          <div class="reveal-container"><details><summary><i class="fas fa-pencil-ruler text-amber-600 mr-2 fa-fw"></i><strong>Action/Task</strong></summary><div class="reveal-content">Use specific verbs to tell the AI what to do. Examples: 'Generate,' 'Explain,' 'List,' 'Summarize,' 'Compare,' 'Translate,' 'Critique.' Be explicit about the desired action.</div></details></div>
          <div class="reveal-container"><details><summary><i class="fas fa-list-ol text-lime-600 mr-2 fa-fw"></i><strong>Format</strong></summary><div class="reveal-content">Specify how you want the output structured. Examples: 'Provide the answer in bullet points,' 'Write a paragraph,' 'Create a table with two columns,' 'Generate a multiple-choice question.'</div></details></div>
          <div class="reveal-container"><details><summary><i class="fas fa-crosshairs text-red-600 mr-2 fa-fw"></i><strong>Target/Topic</strong></summary><div class="reveal-content">Clearly define the specific subject, details, or constraints the AI should focus on. What should it include? What should it avoid? Be precise about the core content you need.</div></details></div>
        </div>
        <p class="mt-4"><strong>Prompting is Iterative: Weak -> Better -> Stronger</strong></p>
        <div class="prompt-comparison my-4">
                 <div class="prompt-box prompt-weak"> <h4>Weak:</h4> <p class="italic">"Lesson plan."</p> <p class="text-sm text-gray-600 mt-2">(Too vague. What subject? What grade? What topic?)</p> </div>
                 <div class="prompt-box prompt-strong"> <h4>Better:</h4> <p class="italic">"Lesson plan ideas for 2nd grade science."</p> <p class="text-sm text-gray-600 mt-2">(Getting closer, but still broad.)</p> </div>
        </div>
        <div class="mt-4 p-4 border border-green-300 bg-green-50 rounded-lg">
          <h4 class="font-semibold text-green-700">Stronger Prompt:</h4>
                 <p class="italic text-green-800">"Generate 3 creative lesson plan ideas for a 2nd-grade science class about the properties of matter (solid, liquid, gas). Include a hands-on activity suggestion and one potential assessment question for each idea. Present the output in bullet points."</p>
          <p class="text-sm text-gray-600 mt-2">(Clear goal, context, details, and format lead to a much more useful result.)</p>
        </div>
        <p class="mt-4">Don't expect perfection on the first try! View prompting as a conversation. Analyze the AI's response and refine your prompt to guide it closer to what you need.</p>
        <div class="my-6 p-4 bg-rose-50 rounded-lg text-center border border-rose-200 shadow-sm">
          <img src="https://i.imgur.com/4cY5XJt.png" alt="Diagram showing prompt elements leading to better output" class="mx-auto rounded shadow max-w-full h-auto mb-2" style="max-height: 150px;" onerror="this.style.display='none'; this.onerror=null;">
          <p class="text-sm text-rose-600 font-medium mt-2">Clear, detailed prompts lead to more helpful AI responses.</p>
        </div>`;
        contentHtml += `<div class="mt-6 p-4 bg-indigo-50 rounded-lg border border-indigo-200"><h4 class="font-semibold text-indigo-700 mb-2">🤔 Think About It:</h4><p class="text-sm text-indigo-600">Think of a recent classroom activity. How could you use the C.R.A.F.T. method (as detailed above) to design a prompt for an AI to help you prepare for it?</p></div>`;
      break;
    case '6':
      contentHtml += `
        <p>The world of AI tools can seem overwhelming! Instead of focusing on specific brand names (which change rapidly), let's understand the main <span class="key-term" role="button" tabindex="0" data-definition="Broad groups such as Content Creation, Idea Generation, Assessment Aids and Accessibility Tools.">categories</span> of tools relevant to educators.</p>
        <p><strong>Common AI Tool Categories for Your Teacher Toolkit:</strong></p>
        <div class="grid md:grid-cols-2 gap-6 mt-4">
          <div class="p-5 bg-sky-50 border border-sky-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
            <h4 class="font-semibold text-sky-700 mb-2"><i class="fas fa-pencil-alt mr-2 fa-fw"></i>Content Creation Aids</h4>
            <p class="text-sm text-gray-700">These tools excel at generating text based on your prompts. Think of them as writing assistants.</p>
            <p class="text-xs text-gray-500 mt-1"><em>Use for: Drafting lesson outlines, generating varied practice questions, writing initial email drafts, creating newsletter snippets, simplifying complex text</em></p>
          </div>
          <div class="p-5 bg-lime-50 border border-lime-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
            <h4 class="font-semibold text-lime-700 mb-2"><i class="fas fa-lightbulb mr-2 fa-fw"></i>Idea Generation & Brainstorming</h4>
            <p class="text-sm text-gray-700">Stuck for ideas? AI can be a fantastic brainstorming partner, offering diverse perspectives and starting points.</p>
            <p class="text-xs text-gray-500 mt-1"><em>Use for: Finding creative lesson hooks, brainstorming project themes, generating writing prompts, suggesting discussion questions, exploring different ways to explain a concept</em></p>
          </div>
          <div class="p-5 bg-amber-50 border border-amber-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
            <h4 class="font-semibold text-amber-700 mb-2"><i class="fas fa-tasks mr-2 fa-fw"></i>Assessment & Feedback Aids</h4>
            <p class="text-sm text-gray-700">Some AI tools can assist with creating assessment materials or providing initial feedback (always review carefully!).</p>
            <p class="text-xs text-gray-500 mt-1"><em>Use for: Generating multiple-choice or T/F questions, creating rubric templates, suggesting feedback criteria, providing grammar/spelling checks (with caution on meaning)</em></p>
          </div>
          <div class="p-5 bg-violet-50 border border-violet-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
            <h4 class="font-semibold text-violet-700 mb-2"><i class="fas fa-universal-access mr-2 fa-fw"></i>Accessibility Tools</h4>
            <p class="text-sm text-gray-700">AI significantly enhances tools that support diverse learners and communication needs.</p>
            <p class="text-xs text-gray-500 mt-1"><em>Use for: Text-to-speech (reading text aloud), speech-to-text (dictation), real-time translation, simplifying complex language for readability</em></p>
          </div>
        </div>
        <div class="reveal-container mt-6">
          <details>
            <summary>What about AI Image Generators? <i class="fas fa-info-circle ml-1 text-sky-500 text-xs"></i></summary>
            <div class="reveal-content"> AI image generators (like Midjourney, DALL-E) create images from text prompts. While potentially useful for custom classroom visuals, they require careful prompting and critical review for appropriateness, bias, and accuracy. Copyright considerations are also complex. Start with text-based tools first! </div>
          </details>
        </div>
        <p class="mt-6">The key is not to master every tool, but to understand the <span class="key-term">types</span> of tasks AI can assist with and develop strong <span class="key-term">prompting skills</span>. Remember that different AI models and tools, even those within the same category, are trained differently and have unique strengths and weaknesses; one tool might excel at creative writing while another is better at summarizing technical text. <span class="font-semibold">Results can vary significantly even for the same prompt across different tools, and even within the same tool over time.</span></p>
        <p class="mt-2">Always investigate a tool's <span class="key-term">privacy policy</span> and ensure it aligns with your school's guidelines before using it, especially if any student information might be involved (even indirectly).</p>
        <div class="my-6 p-4 bg-teal-50 rounded-lg text-center border border-teal-200 shadow-sm">
          <img src="https://i.imgur.com/RAhNsXE.png" alt="AI toolbox graphic with category icons" class="mx-auto rounded shadow max-w-full h-auto mb-2" style="max-height: 150px;" onerror="this.style.display='none'; this.onerror=null;">
          <p class="text-sm text-teal-600 font-medium mt-2">Knowing the categories helps you choose the right tool for the job.</p>
        </div>`;
        contentHtml += `<div class="mt-6 p-4 bg-indigo-50 rounded-lg border border-indigo-200"><h4 class="font-semibold text-indigo-700 mb-2">🤔 Reflection Point:</h4><p class="text-sm text-indigo-600">Reflect on one potential benefit of AI that excites you for your classroom, and one challenge that you feel is most important to address proactively. How might you start to leverage that benefit while mitigating the challenge?</p></div>`;
      break;
    case '7':
      contentHtml += `
        <p>Let's see the difference prompting makes! Instead of just showing examples, try simulating an AI interaction below. Click 'Submit' for each prompt to see a potential AI response.</p>
        <hr class="my-6 border-gray-300">
        <h4 class="text-lg font-semibold mb-3 text-indigo-700">Scenario 1: Differentiating Reading Questions</h4>
        <p class="mb-4 text-sm text-gray-600">Goal: Get reading comprehension questions for Chapter 2 of 'Charlotte's Web' for a 3rd-grade class.</p>
             <div class="mb-6"> <h5 class="font-semibold mb-2">Attempt 1: Basic Prompt</h5> <div class="sim-prompt-box"> <code>Write reading questions for Charlotte's Web Chapter 2.</code> </div> <button data-response-target="response-s1-basic" class="sim-submit-btn sim-prompt-submit">Submit Basic Prompt</button> <div id="response-s1-basic" class="sim-response-box"> <strong class="block mb-2">Simulated AI Response:</strong> <p>1. What happens in Chapter 2?<br>2. Who are the main characters introduced?<br>3. Describe the setting.<br><em>(Critique: Very generic, not specific to grade level or question types needed.)</em></p> </div> </div>
             <div class="mb-6"> <h5 class="font-semibold mb-2">Attempt 2: Detailed (CRAFT) Prompt</h5> <div class="sim-prompt-box"> <code>Generate 3 reading comprehension questions about Chapter 2 of 'Charlotte's Web' suitable for a 3rd-grade class. Include one literal question, one inferential question, and one evaluative question.</code> </div> <button data-response-target="response-s1-detailed" class="sim-submit-btn sim-prompt-submit">Submit Detailed Prompt</button> <div id="response-s1-detailed" class="sim-response-box"> <strong class="block mb-2">Simulated AI Response:</strong> <p>1. (Literal) What was the first message Charlotte wrote in her web?<br>2. (Inferential) Why did Charlotte decide to help Wilbur?<br>3. (Evaluative) Do you think it's fair for Templeton to demand food in exchange for help? Why or why not?<br><em>(Critique: Much better! Questions are specific, varied, and targeted to the grade level.)</em></p> </div> </div>
        <hr class="my-8 border-gray-300">
        <h4 class="text-lg font-semibold mb-3 text-indigo-700">Scenario 2: Drafting Parent Communication</h4>
        <p class="mb-4 text-sm text-gray-600">Goal: Draft a short reminder email about an upcoming field trip.</p>
             <div class="mb-6"> <h5 class="font-semibold mb-2">Attempt 1: Basic Prompt</h5> <div class="sim-prompt-box"> <code>Write email about field trip.</code> </div> <button data-response-target="response-s2-basic" class="sim-submit-btn sim-prompt-submit">Submit Basic Prompt</button> <div id="response-s2-basic" class="sim-response-box"> <strong class="block mb-2">Simulated AI Response:</strong> <p>Subject: Field Trip<br><br>Dear Parents,<br>Reminder about the field trip.<br>Thanks,<br>Teacher<br><em>(Critique: Too brief, lacks essential details like date, destination, what to bring.)</em></p> </div> </div>
             <div class="mb-6"> <h5 class="font-semibold mb-2">Attempt 2: Detailed (CRAFT) Prompt</h5> <div class="sim-prompt-box"> <code>Write a short, friendly paragraph for our weekly 2nd-grade classroom newsletter reminding families about the upcoming field trip to the City Zoo next Friday, May 10th. Mention they need signed permission slips returned by Wednesday, May 8th, and should pack a lunch and drink. Keep the tone positive.</code> </div> <button data-response-target="response-s2-detailed" class="sim-submit-btn sim-prompt-submit">Submit Detailed Prompt</button> <div id="response-s2-detailed" class="sim-response-box"> <strong class="block mb-2">Simulated AI Response:</strong> <p>Just a friendly reminder that our exciting 2nd-grade field trip to the City Zoo is coming up next Friday, May 10th! Please make sure your child returns their signed permission slip by this Wednesday, May 8th, so they can join the fun. Also, remember to pack a yummy lunch and drink for them on the day of the trip. We can't wait for our animal adventure!</p> <em>(Critique: Includes all necessary details in a suitable tone.)</em> </div> </div>
             <p class="mt-6 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-4 rounded-r-lg"> <strong class="block font-semibold"><i class="fas fa-lightbulb mr-1"></i> Key Takeaway:</strong> Notice how adding specific details (Context, Role, Action, Format, Target) significantly improves the quality and usefulness of the AI's response. Remember to always review and personalize any AI-generated text before using it! </p>`;
      break;
    case '8':
      contentHtml += `
        <p>Embracing AI means understanding both its bright possibilities and its potential pitfalls. A balanced perspective is key to using it wisely.</p>
        <p><strong>Weighing the Pros and Cons for Educators (Click each item to learn more):</strong></p>
        <div class="benefit-challenge-grid my-6">
                 <div class="benefit-box space-y-3"> <h4 class="text-center"><i class="fas fa-check-circle mr-2"></i>Potential Benefits</h4>
                     <details class="reveal-container"> <summary>Efficiency & Time Savings</summary> <div class="reveal-content">AI can automate or speed up repetitive tasks like drafting initial lesson plans, generating practice questions, or summarizing long documents, freeing up valuable teacher time.</div> </details>
                     <details class="reveal-container"> <summary>Idea Generation & Creativity Spark</summary> <div class="reveal-content">AI can act as a brainstorming partner, suggesting diverse ideas for activities, projects, or ways to explain complex topics, helping overcome planning blocks.</div> </details>
                     <details class="reveal-container"> <summary>Support for Differentiation</summary> <div class="reveal-content">AI can assist in creating varied materials, such as leveled reading passages or math problems adjusted for different skill levels, making differentiation more manageable.</div> </details>
                     <details class="reveal-container"> <summary>Enhanced Accessibility</summary> <div class="reveal-content">AI powers tools like text-to-speech, dictation, and translation, which can provide crucial support for students with diverse learning needs or language backgrounds.</div> </details>
                     <details class="reveal-container"> <summary>Personalization Potential</summary> <div class="reveal-content">While still evolving, AI holds potential for helping tailor learning paths or suggesting resources based on individual student progress (requires careful implementation and oversight).</div> </details>
              </div>
                 <div class="challenge-box space-y-3"> <h4 class="text-center"><i class="fas fa-exclamation-triangle mr-2"></i>Challenges & Considerations</h4>
                     <details class="reveal-container"> <summary>Accuracy & "Hallucinations"</summary> <div class="reveal-content">AI can generate incorrect, misleading, or nonsensical information (sometimes called 'hallucinations'). Fact-checking by the teacher is essential.</div> </details>
                     <details class="reveal-container"> <summary>Potential Bias</summary> <div class="reveal-content">AI learns from vast datasets, which can contain human biases. These biases can be reflected in AI outputs, potentially perpetuating stereotypes if not carefully reviewed.</div> </details>
                     <details class="reveal-container"> <summary>Data Privacy & Security</summary> <div class="reveal-content">Inputting sensitive student data (names, grades, personal details) into public or non-vetted AI tools poses significant privacy risks. Adherence to school/district policies is critical.</div> </details>
                     <details class="reveal-container"> <summary>Risk of Over-Reliance</summary> <div class="reveal-content">Depending too heavily on AI for tasks like planning or writing can potentially hinder the development or use of one's own creativity and critical thinking skills.</div> </details>
                     <details class="reveal-container"> <summary>Ethical Use & Academic Integrity</summary> <div class="reveal-content">Clear guidelines are needed for both teachers (transparency about AI use) and students (preventing plagiarism, understanding appropriate use) to maintain academic honesty.</div> </details>
                     <details class="reveal-container"> <summary>Equity & Access (Digital Divide)</summary> <div class="reveal-content">Unequal access to AI tools, internet connectivity, or necessary training can widen existing equity gaps among students and staff.</div> </details>
          </div>
        </div>
        <p>Approach AI as a powerful but flawed <span class="key-term" role="button" tabindex="0" data-definition="A supportive AI tool that helps you complete a task but still relies on your direction and judgement.">assistant</span>. Leverage its speed and pattern-finding abilities, but always apply your <span class="key-term">professional judgment</span>, <span class="key-term">critical thinking</span>, and <span class="key-term">ethical compass</span>. You remain the expert on your students and your classroom context.</p>
        <div class="my-6 p-4 bg-orange-50 rounded-lg text-center border border-orange-200 shadow-sm">
          <img src="https://i.imgur.com/EPfm2wG.png" alt="Scale balancing AI benefits and risks" class="mx-auto rounded shadow max-w-full h-auto mb-2" style="max-height: 150px;" onerror="this.style.display='none'; this.onerror=null;">
          <p class="text-sm text-orange-600 font-medium mt-2">A balanced understanding leads to more effective and responsible AI integration.</p>
        </div>`;
      break;
    case '9':
      contentHtml += `
        <p>Using AI effectively goes hand-in-hand with using it <span class="key-term">responsibly</span> and <span class="key-term">ethically</span>. Protecting students and upholding professional standards must always be the priority.</p>
        <p><strong>Your Safety & Ethics Checklist:</strong></p>
        <ul class="safety-checklist list-none p-0 my-4 space-y-4">
          <li><i class="fas fa-shield-alt text-red-shield"></i> <strong>Guard Student Privacy (PII):</strong> This is paramount. <span class="font-bold">NEVER input Personally Identifiable Information (PII)</span> about students (names, grades, specific personal details, photos) into public AI tools unless explicitly approved and vetted by your school/district for compliance with privacy laws (like FERPA/COPPA). Anonymize any necessary scenarios.</li>
          <li><i class="fas fa-balance-scale text-blue-check"></i> <strong>Verify Accuracy & Check for Bias:</strong> Treat AI output as a first draft. <span class="font-semibold">Fact-check critical information.</span> Read carefully for biases. Discard or heavily edit biased content.</li>
          <li><i class="fas fa-info-circle text-yellow-info"></i> <strong>Practice Transparency:</strong> Be open about your use of AI with relevant stakeholders as appropriate per your context and policies. Don't represent significant AI work as solely your own.</li>
          <li><i class="fas fa-user-check text-purple-eye"></i> <strong>Exercise Human Oversight & Judgment:</strong> You are the educator! <span class="font-semibold">Always review, edit, and approve AI content</span> before use. Ensure instructional fit and appropriateness.</li>
          <li><i class="fas fa-copyright text-cyan-600"></i> <strong>Consider Copyright:</strong> Be mindful of the evolving legal landscape. Avoid using AI to directly replicate copyrighted material. Focus on ideas and drafts.</li>
          <li><i class="fas fa-gavel text-gray-policy"></i> <strong>Adhere to Policies:</strong> <span class="font-bold">Know and follow your school and district's Acceptable Use Policies (AUP)</span> regarding AI tools, data security, and digital citizenship.</li>
        </ul>
        <p><strong>Thinking Through Scenarios:</strong></p>
        <ul class="list-none p-0 space-y-2 mt-4">
          <li><span class="inline-block bg-green-100 text-green-700 px-2 py-0.5 rounded text-sm mr-2">SAFER <i class="fas fa-check"></i></span> Asking AI: "Generate 5 ideas for teaching fractions using visual aids for 3rd graders"</li>
          <li><span class="inline-block bg-red-100 text-red-700 px-2 py-0.5 rounded text-sm mr-2">RISKY <i class="fas fa-times"></i></span> Pasting this into a public AI: "My student Maria G. is struggling with fractions... Give me ideas." (Contains PII - Personally Identifiable Information)</li>
          <li><span class="inline-block bg-green-100 text-green-700 px-2 py-0.5 rounded text-sm mr-2">SAFER <i class="fas fa-check"></i></span> Using AI to create a *template* for a parent email, then personalizing and reviewing it thoroughly</li>
          <li><span class="inline-block bg-red-100 text-red-700 px-2 py-0.5 rounded text-sm mr-2">RISKY <i class="fas fa-times"></i></span> Relying on AI for definitive advice on handling specific student behavior issues without consulting school resources</li>
        </ul>
        <div class="my-6 p-4 bg-red-50 rounded-lg text-center border border-red-200 shadow-sm">
          <img src="https://i.imgur.com/DrKjhe9.png" alt="Shield protecting student data icon" class="mx-auto rounded shadow max-w-full h-auto mb-2" style="max-height: 150px;" onerror="this.style.display='none'; this.onerror=null;">
          <p class="text-sm text-red-600 font-medium mt-2">Ethical considerations and safety protocols must guide our AI use.</p>
        </div>`;
        contentHtml += `<div class="mt-6 p-4 bg-indigo-50 rounded-lg border border-indigo-200"><h4 class="font-semibold text-indigo-700 mb-2">🤔 Consider This:</h4><p class="text-sm text-indigo-600">Imagine you want to use an AI tool to help brainstorm scenarios for a social skills lesson. How would you phrase your prompt to get useful ideas while strictly adhering to student privacy guidelines (i.e., not using any PII)?</p></div>`;
      break;
    case '10':
      contentHtml += `
        <p>Feeling ready to dip your toes into using AI? Excellent! The best approach is <span class="key-term">thoughtful experimentation</span>, starting small and building confidence.</p>
        <p><strong>Practical Steps for Getting Started:</strong></p>
        <ol class="getting-started-steps list-none p-0 my-4 space-y-5">
          <li> <strong>Identify a Low-Stakes, High-Impact Task:</strong> What takes time but errors aren't critical? <em class="block text-sm text-gray-600 mt-1">Examples: Brainstorming prompts, generating fun facts, drafting reminder templates, finding synonyms.</em> </li>
          <li> <strong>Consult Your District's Guidance & Tools:</strong> <span class="font-bold">Check policies FIRST.</span> Use approved tools if available. Be cautious with others. </li>
          <li> <strong>Craft a Clear, Contextual Prompt:</strong> Remember Section 5! Define task, context, details, format. </li>
          <li> <strong>Critically Review & Iterate:</strong> Treat AI output as raw material. Check accuracy, bias, appropriateness. <span class="font-semibold">Refine your prompt</span> and try again if needed. </li>
          <li> <strong>Reflect & Learn:</strong> Did it help? What worked? What didn't? Share with colleagues. </li>
        </ol>
        <p><strong>Mindset Matters:</strong></p>
        <ul class="list-disc list-inside ml-4 space-y-2 text-gray-700">
          <li>Aim for <span class="key-term" role="button" tabindex="0" data-definition="Using AI to enhance (not replace) your own skills and efficiency.">augmentation</span>, not automation</li>
          <li>Embrace <span class="key-term">curiosity</span>. Find reliable EdTech resources</li>
          <li>Prioritize <span class="key-term">ethics and student well-being</span></li>
          <li>Collaborate! Talk to colleagues</li>
        </ul>
        <div class="my-6 p-4 bg-green-50 rounded-lg text-center border border-green-200 shadow-sm">
          <img src="https://i.imgur.com/xhmxwoG.png" alt="Small steps leading upwards with AI icon" class="mx-auto rounded shadow max-w-full h-auto mb-2" style="max-height: 150px;" onerror="this.style.display='none'; this.onerror=null;">
          <p class="text-sm text-green-600 font-medium mt-2">Start small, stay critical, adhere to policy, and focus on augmenting your practice.</p>
        </div>`;
      break;
    case '11':
      contentHtml += `
        <p class="text-lg font-semibold text-green-700">Module Complete! You've taken a significant step in understanding AI in education.</p>
        <p>We've journeyed from the basic definition of AI and its history to practical ways it can assist in your elementary classroom, emphasizing the crucial importance of ethical and responsible use.</p>
        <p><strong>Let's Recap Your Key Learning Targets:</strong></p>
        <ul class="summary-points list-none p-0 my-4 space-y-3 text-gray-700">
          <li>Describe AI simply, recognize its history and types</li>
          <li>Understand AI learns via patterns, not comprehension</li>
          <li>Craft effective prompts (goal, context, specifics, format)</li>
          <li>Identify key AI tool categories for teachers</li>
          <li>Articulate AI benefits and challenges in education</li>
          <li>Apply principles for safe/ethical AI use (privacy, oversight)</li>
          <li>Outline steps for thoughtful AI integration</li>
        </ul>
        <p class="mt-4">The world of AI is dynamic, but the principles of good teaching – critical thinking, ethical responsibility, understanding your students, and instructional expertise – remain paramount. AI is a tool; <span class="font-bold">you</span> are the educator.</p>
        <div class="my-6 p-4 bg-sky-50 rounded-lg text-center border border-sky-200 shadow-sm">
          <img src="https://i.imgur.com/2OWv54v.png" alt="Graduation cap pointing towards final quiz" class="mx-auto rounded shadow max-w-full h-auto mb-2" style="max-height: 150px;" onerror="this.style.display='none'; this.onerror=null;">
          <p class="text-sm text-sky-600 font-medium mt-2">Consolidate your learning with the final quiz!</p>
        </div>
        <p><strong>What's Next?</strong></p>
        <p>To complete the module and earn your certificate, proceed to the <strong>Final Quiz</strong>. This quiz covers key concepts from all the sections you've explored.</p>
        <p>Click the "Next" button below when you're ready. Good luck!</p>`;
      break;
    case 'final-quiz':
      contentHtml += `<p class="text-lg font-medium">Final Knowledge Check!</p> <p>This final quiz assesses your understanding of the key concepts covered throughout the module. It includes ${quizzes['final-quiz']?.length || 10} questions drawn from all sections.</p> <p>Remember, if you get stuck on a question, the feedback for incorrect answers will link back to the relevant section for review.</p>`;
      const finalResult = state.quizResults['final-quiz'];
      if (finalResult?.completed) {
        contentHtml += `<div class="mt-6 p-4 bg-blue-50 rounded-md border border-blue-200 shadow-sm"> <p class="text-blue-700 font-medium">You have previously completed the final quiz.</p> <p class="text-sm text-blue-600">Your last score was: ${finalResult.score}/${finalResult.total}</p> <button id="startFinalQuizBtn" class="mt-3 px-5 py-2 text-sm text-white bg-sky-600 rounded-md hover:bg-sky-700 shadow transition duration-150 ease-in-out">Retake Final Quiz</button> </div>`;
      } else {
        contentHtml += `<button id="startFinalQuizBtn" class="mt-6 px-8 py-3 text-lg text-white bg-green-600 rounded-md hover:bg-green-700 shadow-md transition duration-150 ease-in-out">Start Final Quiz</button>`;
      }
      break;
    case 'certificate':
      contentHtml += `<h4 class="text-2xl font-semibold text-green-700 mb-4"><i class="fas fa-award mr-2"></i>Module Complete!</h4> <p>Congratulations on successfully completing the AI Training Module for Elementary Teachers!</p>`;
      if (state.finalQuizCompleted) {
        contentHtml += `<p class="mt-2 text-gray-700">You've demonstrated your understanding of key AI concepts and responsible use in education. Generate your personalized certificate below.</p> <div class="mt-6"> <label for="certificateName" class="block text-base font-medium text-gray-700 mb-2">Enter Your Name for the Certificate:</label> <input type="text" id="certificateName" value="${state.userName || ''}" placeholder="Your Full Name" class="w-full max-w-md p-2 border border-gray-300 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500 text-center text-lg"> <button id="generateCertBtn" class="mt-4 px-8 py-3 text-lg text-white bg-sky-500 rounded-md hover:bg-sky-600 no-print shadow transition duration-150 ease-in-out">Generate Certificate</button> </div> <div id="certificateOutput" class="mt-8 hidden"> </div>`;
      } else {
        contentHtml += `<p class="mt-4 text-red-600 font-medium">You must successfully complete the <a href="#" onclick="navigateToSection('final-quiz'); return false;" class="text-sky-600 hover:underline font-semibold">Final Quiz</a> before you can generate your certificate.</p>`;
      }
      break;
    default:
      contentHtml += `<p>Content loading error.</p>`;
  }

  contentHtml += `</div>`;

  if (section.quiz && section.id !== 'final-quiz' && section.id !== 'certificate') {
    contentHtml += `<hr class="my-8 border-gray-300">`;
    contentHtml += `<h4 class="text-lg font-semibold mb-4 text-center text-gray-700">Check Your Understanding</h4>`;
    if (section.id === 3 && !state.timelineInteractedS3) {
        contentHtml += `<p class="text-center text-gray-600 italic mt-4">Please click on an era in the timeline above to learn more and unlock the quiz.</p>`;
    } else {
        const quizResult = state.quizResults[section.id];
        if (quizResult?.completed) {
            contentHtml += `<div class="mt-4 p-4 bg-green-50 rounded-lg border border-green-200 flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0 shadow-sm"> <div class="text-center sm:text-left"> <p class="text-green-800 font-medium">Section ${section.id} Quiz Completed!</p> <p class="text-sm text-green-700">Your score: ${quizResult.score}/${quizResult.total}</p> </div> <button data-quiz-id="${section.id}" class="retakeQuizBtn px-5 py-2 text-sm text-white bg-sky-600 rounded-md hover:bg-sky-700 shadow transition duration-150 ease-in-out whitespace-nowrap">Retake Quiz</button> </div>`;
        } else {
            contentHtml += `<div class="mt-4 text-center"> <button data-quiz-id="${section.id}" class="takeQuizBtn px-8 py-3 text-lg text-white bg-green-600 rounded-md hover:bg-green-700 shadow-md transition duration-150 ease-in-out">Take Section ${section.id} Quiz</button> </div>`;
        }
    }
  }

  contentHtml += `</div>`;
  contentArea.innerHTML = contentHtml;

  if (section.id === 3) {
      injectTimeline();
  }

  updateNavButtons();
  updateSidebarActive();
}
function getSidebarLinks() {
    return document.querySelectorAll('.sidebar-link');
}

/* === NEW: Swipe Gesture Handler Functions === */
function handleTouchStart(event) {
    // Only capture start if on mobile and touch is on content area or sidebar itself
    if (window.innerWidth < 768) { // md breakpoint
        // Check if the touch is on the open sidebar button; if so, let the button handle it
        if (openSidebarBtn && openSidebarBtn.contains(event.target)) {
            return;
        }
        touchStartX = event.changedTouches[0].screenX;
    }
}

function handleTouchMove(event) {
    if (window.innerWidth < 768 && touchStartX !== 0) { // Only track if touch started
        touchEndX = event.changedTouches[0].screenX;
        // Optional: Could add logic here to prevent vertical scroll if a horizontal swipe is clearly detected
        // For example, if Math.abs(touchEndX - touchStartX) > Math.abs(event.changedTouches[0].screenY - initialY)
        // event.preventDefault();
    }
}

function handleTouchEnd(event) {
    if (window.innerWidth < 768 && touchStartX !== 0) { // md breakpoint and touch has started
        const swipeDistance = touchEndX - touchStartX;
        const sidebarIsOpen = !sidebar.classList.contains('-translate-x-full');

        // Swipe Right to Open
        if (swipeDistance > swipeThreshold && !sidebarIsOpen) {
            // Check if the touch started near the left edge of the screen
            // This makes opening more intentional, adjust `edgeThreshold` as needed
            const edgeThreshold = 50; // pixels from the left edge
            if (touchStartX < edgeThreshold) {
                 sidebar.classList.remove('-translate-x-full');
                 console.log("Swiped right to open sidebar");
            }
        }
        // Swipe Left to Close
        else if (swipeDistance < -swipeThreshold && sidebarIsOpen) {
            // Check if the touch happened on the sidebar itself or started on the sidebar
            // For simplicity, we can allow closing by swiping left anywhere if it's open,
            // or be more specific if needed (e.g., if (sidebar.contains(event.target) || touch started on sidebar))
            sidebar.classList.add('-translate-x-full');
            console.log("Swiped left to close sidebar");
        }
    }
    // Reset touch coordinates
    touchStartX = 0;
    touchEndX = 0;
}


/* === Event listeners (DOMContentLoaded) === */
document.addEventListener('DOMContentLoaded', () => {
  if (openSidebarBtn) openSidebarBtn.addEventListener('click', () => sidebar.classList.remove('-translate-x-full'));
  if (closeSidebarBtn) closeSidebarBtn.addEventListener('click', () => sidebar.classList.add('-translate-x-full'));
// Inside DOMContentLoaded
getSidebarLinks().forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const linkElement = e.target.closest('a'); // Get the link element itself
        const sectionId = linkElement.getAttribute('data-section');
		const numericTargetId       = getNumericSectionId(sectionId);
		if (numericTargetId === -1) return;        // unknown link
		const numericHighestUnlocked = getNumericSectionId(state.highestSectionUnlocked)

        // Check if the link is actually enabled before navigating
        if (!linkElement.classList.contains('disabled-link') && numericTargetId <= numericHighestUnlocked) {
             navigateToSection(sectionId);
        } else {
            console.log(`Section ${sectionId} is locked.`);
            // Optional: Add a visual cue like a slight shake or tooltip?
        }
    });
});
  if (prevBtn) prevBtn.addEventListener('click', () => { const currentIndex = sections.findIndex(s => String(s.id) == String(state.currentSectionId)); if (currentIndex > 0) navigateToSection(sections[currentIndex - 1].id); });
  if (nextBtn) nextBtn.addEventListener('click', () => {
    const currentIndex = sections.findIndex(s => String(s.id) == String(state.currentSectionId));
    const currentSection = sections[currentIndex];
    let canProceed = true; // Assume true initially

    // Check if current section requires a completed quiz (existing logic)
    if (currentSection && currentSection.id !== 1 && currentSection.quiz && !state.quizResults[currentSection.id]?.completed) {
      canProceed = false;
      if (currentSection.id === 3 && !state.timelineInteractedS3) canProceed = false;
    }
    // Check if trying to proceed from final quiz without completing it
    if (currentSection && currentSection.id === 'final-quiz' && !state.finalQuizCompleted) {
      canProceed = false;
    }

    // If okay to proceed and not the last section
    if (currentIndex < sections.length - 1 && canProceed) {
        const nextSection = sections[currentIndex + 1];
        if (nextSection) {
            // Unlock the *next* section before navigating
            updateHighestUnlocked(nextSection.id);
            navigateToSection(nextSection.id);
        }
    } else if (!canProceed) { // Show alerts if cannot proceed (existing logic)
         if (currentSection && currentSection.quiz) {
             if (currentSection.id === 3 && !state.timelineInteractedS3) {
                 alert(`Please explore the timeline in "${currentSection.title}" before proceeding.`);
             } else {
                 alert(`Please complete the quiz for "${currentSection.title}" before proceeding.`);
             }
         } else if (currentSection && currentSection.id === 'final-quiz') {
             alert(`Please complete the Final Quiz before proceeding to the certificate.`);
         }
    }
});
  if (submitQuizBtn) submitQuizBtn.addEventListener('click', submitQuiz);
  if (resetQuizBtn) resetQuizBtn.addEventListener('click', resetQuiz);
  if (closeQuizBtn) closeQuizBtn.addEventListener('click', closeQuiz);
  if (resetModuleBtn) resetModuleBtn.addEventListener('click', resetModule);

  if (contentArea) {
      contentArea.addEventListener('click', function(event) {
          const target = event.target.closest('button');
          if (!target) return;

          if (target.matches('.takeQuizBtn') || target.matches('.retakeQuizBtn')) {
              const quizId = target.getAttribute('data-quiz-id');
              if (quizId) openQuiz(quizId);
          } else if (target.matches('#startFinalQuizBtn')) {
      openQuiz('final-quiz');
          } else if (target.matches('#generateCertBtn')) {
      generateCertificate();
          } else if (target.matches('#beginModuleBtn')) {
			navigateToSection(2);
			updateHighestUnlocked(2); // Unlock section 2
          } else if (target.matches('.sim-prompt-submit')) {
      event.preventDefault();
               const responseTargetId = target.getAttribute('data-response-target');
               const responseBox = document.getElementById(responseTargetId);
               if (responseBox) {
                   responseBox.classList.add('visible');
                   target.disabled = true;
                   target.textContent = 'Response Shown';
               }
          } else if (target.matches('#audioPlayerBtn')) {
              toggleAudioPlayback(target, state.currentSectionId);
          }
      });
       contentArea.addEventListener('input', function(event) {
           if (event.target.matches('#certificateName')) {
               state.userName = event.target.value;
           }
       });
  }
   if (quizContent) {
       quizContent.addEventListener('change', (e) => {
           if (quizAttempted) return;
           const targetInput = e.target;
           if (!targetInput.matches('input[type="radio"], select.matching-select')) return;
           const qIndex = parseInt(targetInput.name.match(/q(\d+)/)[1]);
           const questionData = quizzes[currentQuizId]?.[qIndex];
           if (!questionData) return;
           if (questionData.type === 'matching') {
               if (!currentQuizAnswers[qIndex]) currentQuizAnswers[qIndex] = {};
               const itemId = targetInput.name.split('-')[1];
               currentQuizAnswers[qIndex][itemId] = targetInput.value;
           } else {
               let value = targetInput.value;
               if (questionData.type === 'tf') { value = (value === 'true'); }
               else if (questionData.type === 'mc' || questionData.type === 'ordering_mc') { value = parseInt(value); }
               currentQuizAnswers[qIndex] = value;
           }
           const feedbackEl = document.getElementById(`feedback-${qIndex}`);
           if (feedbackEl && (feedbackEl.textContent === 'Please select an answer.' || feedbackEl.textContent === 'Please make a selection for each item.')) {
               feedbackEl.textContent = '';
               feedbackEl.className = 'mt-4 text-sm';
           }
       });
   }

  // Click outside to close sidebar (existing)
  document.addEventListener('click', (event) => {
    if (window.innerWidth < 768) { // md breakpoint
        const openSidebarBtn = document.getElementById('openSidebarBtn'); // Ensure this is the correct ID
        if (sidebar && !sidebar.classList.contains('-translate-x-full')) { // If sidebar is open
            const isClickInsideSidebar = sidebar.contains(event.target);
            const isClickOnOpenButton = openSidebarBtn && openSidebarBtn.contains(event.target);
            if (!isClickInsideSidebar && !isClickOnOpenButton) {
                sidebar.classList.add('-translate-x-full');
            }
        }
    }
  });

  // --- NEW: Add Swipe Event Listeners ---
  // We'll attach to document.body for broad capture on mobile.
  // Could be refined to specific elements like `contentArea` or `sidebar` if needed.
  document.body.addEventListener('touchstart', handleTouchStart, { passive: true }); // passive:true if not calling preventDefault
  document.body.addEventListener('touchmove', handleTouchMove, { passive: true });  // passive:true if not calling preventDefault
  document.body.addEventListener('touchend', handleTouchEnd);


  window.addEventListener('beforeunload', stopAudio);

  loadState();
  updateSidebarAccess();     // ← NEW: apply greyed‑out style immediately
  navigateToSection(state.currentSectionId);
});

// --- Helper Functions (loadState, saveState, resetModule, injectTimeline, etc. are the same as before) ---
// Make sure all previous helper functions are included here.
// For brevity, I'm only showing the new swipe functions and the modified DOMContentLoaded.
// The full script would include all previous functions.
/**
 * Converts section IDs (numbers or strings like 'final-quiz') into comparable numeric values.
 * @param {string|number} sectionId - The ID of the section.
 * @returns {number} A numeric representation for comparison.
 */



/**
 * Updates the highest unlocked section if the new one is further along.
 * @param {string|number} newlyUnlockedId - The ID of the section that might be newly unlocked.
 */
function updateHighestUnlocked(newlyUnlockedId) {
	const numericCurrentHighest = getNumericSectionId(state.highestSectionUnlocked);
	const numericNewlyUnlocked  = getNumericSectionId(newlyUnlockedId);
	if (numericNewlyUnlocked === -1) return;  // unknown id

    if (numericNewlyUnlocked > numericCurrentHighest) {
        state.highestSectionUnlocked = newlyUnlockedId;
        console.log(`Highest section unlocked updated to: ${state.highestSectionUnlocked}`);
        saveState(); // Save the updated state
        updateSidebarAccess(); // Update the sidebar visuals/accessibility
    }
}

/**
 * Updates the visual and accessibility state of sidebar links based on progress.
 */
function updateSidebarAccess() {
		const numericHighestUnlocked = getNumericSectionId(state.highestSectionUnlocked);
		getSidebarLinks().forEach(link => {
		const linkSectionId       = link.getAttribute('data-section');
		const numericLinkSectionId = getNumericSectionId(linkSectionId);

        if (numericLinkSectionId <= numericHighestUnlocked) {
            // Unlock the link
            link.classList.remove('disabled-link');
            link.removeAttribute('tabindex');
            link.removeAttribute('aria-disabled');
            link.style.pointerEvents = ''; // Re-enable pointer events if previously disabled
            // Ensure href allows navigation (it should be '#' by default)
            if (link.getAttribute('href') === 'javascript:void(0);') {
                link.setAttribute('href', '#');
            }
        } else {
            // Lock the link
            link.classList.add('disabled-link');
            link.setAttribute('tabindex', '-1'); // Remove from tab order
            link.setAttribute('aria-disabled', 'true'); // Accessibility
            link.style.pointerEvents = 'none'; // Explicitly disable pointer events
            // Optionally disable href completely
            // link.setAttribute('href', 'javascript:void(0);');
        }
    });
    // Also update the active state (which might have been overridden by disabled)
    updateSidebarActive();
}
function loadState() {
  const savedState = localStorage.getItem('aiTeacherTrainingState');
  if (savedState) {
    try {
      const parsedState = JSON.parse(savedState);
      state = {
        ...state, // Default state values
        ...parsedState, // Overwrite with saved values
        quizResults: parsedState.quizResults || {},
        timelineInteractedS3: parsedState.timelineInteractedS3 || false,
        highestSectionUnlocked: parsedState.highestSectionUnlocked || 1 // Load or default to 1
      };
    } catch (e) {
      console.error("Failed to parse saved state, resetting.", e);
      localStorage.removeItem('aiTeacherTrainingState');
      state.highestSectionUnlocked = 1; // Ensure default on error
    }
  } else {
     state.highestSectionUnlocked = 1; // Ensure default if no saved state
  }
}
function saveState() {
  try {
    localStorage.setItem('aiTeacherTrainingState', JSON.stringify(state));
  } catch (e) {
    console.error("Failed to save state:", e);
    alert("Warning: Could not save your progress. Local storage might be full or disabled.");
  }
}
function resetModule() {
  const userConfirmed = window.confirm("Are you sure you want to reset all module progress? This cannot be undone.");
  if (userConfirmed) {
    stopAudio();
    localStorage.removeItem('aiTeacherTrainingState');
    state = { // Reset to initial state structure
      currentSectionId : 1,
      quizResults      : {},
      finalQuizCompleted: false,
      userName         : '',
      timelineInteractedS3: false,
      highestSectionUnlocked: 1 // Reset progress
    };
    navigateToSection(1); // Navigate back to start
    updateSidebarAccess(); // Update sidebar visuals immediately
    const certOutput = document.getElementById('certificateOutput');
    if (certOutput) certOutput.classList.add('hidden');
  }
}

function injectTimeline() {
  const placeholder = document.getElementById('interactive-timeline-placeholder');
  if (!placeholder) return;
  const eventDetails = {
    event1: {
      id: "event1", year: "1950s", title: "Foundational Ideas",
      content: "Early pioneers like Alan Turing explored 'thinking machines.' The term 'Artificial Intelligence' was coined at the Dartmouth Workshop (1956). Focus was on <span class='key-term' title='A type of AI that processes information by manipulating symbols (like words or concepts) and using logical rules, similar to how humans might solve logic puzzles or reason abstractly.'>symbolic reasoning</span> (e.g., using symbols and rules, like logic puzzles), problem-solving, and logic. <a href='https://www.datacamp.com/blog/what-is-symbolic-ai' target='_blank' rel='noopener noreferrer' class='text-sky-600 hover:underline text-sm'>Learn more about Symbolic AI</a>.",
      milestones: [
        { text: "<a href='https://en.wikipedia.org/wiki/Turing_test' target='_blank' rel='noopener noreferrer' class='text-sky-600 hover:underline'>Turing Test proposed</a>", icon: "fa-solid fa-lightbulb" },
        { text: "Logic Theorist program (early AI)", icon: "fa-solid fa-brain" },
        { text: "Perceptron invented (early neural net)", icon: "fa-solid fa-circle-nodes" }
      ],
      factoid: "Did you know? The Dartmouth Workshop, which coined the term 'AI', brought together researchers who predicted significant progress within a generation."
    },
    event2: {
      id: "event2", year: "1960s-80s", title: "Early Explorations & Winters",
      content: "Initial excitement led to research in areas like natural language processing (ELIZA) and robotics (Shakey). However, limitations in computing power, data, and overly ambitious goals (like creating truly <span class='key-term' title='AI systems capable of understanding and generating human-like conversation across a wide range of topics.'>conversational AI</span> – which modern large language models are now significantly advancing – or developing <span class='key-term' title='AI programs designed to play complex strategy games like chess or Go at or above human expert levels.'>chess-playing programs</span> capable of defeating world champions, a milestone achieved in the late 1990s) led to 'AI winters'—periods of reduced funding.",
      milestones: [
        { text: "ELIZA chatbot created", icon: "fa-solid fa-comment-dots" },
        { text: "Shakey the robot developed", icon: "fa-solid fa-robot" },
        { text: "First 'AI Winter' begins (~mid-70s)", icon: "fa-solid fa-snowflake" }
      ],
      factoid: "Did you know? The Lighthill Report in the UK heavily criticized AI research in 1973, contributing significantly to the first 'AI Winter'."
    },
    event3: {
      id: "event3", year: "1980s-00s", title: "Rise of Machine Learning",
      content: "Focus shifted towards <span class='key-term' title='A subfield of AI where systems learn from data to improve performance on specific tasks without being explicitly programmed for each case.'>Machine Learning</span>—enabling computers to learn from data, often overcoming some limitations of purely rule-based symbolic systems when dealing with uncertainty and vast datasets. While symbolic AI laid crucial groundwork for representing knowledge, machine learning offered new ways to acquire that knowledge from experience. <span class='key-term' title='AI systems designed to emulate the decision-making ability of a human expert in a narrow domain, using a knowledge base and inference rules.'>Expert systems</span> (AI for specific tasks) saw commercial success in fields like medical diagnosis (e.g., MYCIN) and finance. Specialized hardware like Lisp machines from companies such as Symbolics also supported AI development during this period. Key algorithms like <span class='key-term' title='A fundamental algorithm for training artificial neural networks. It works by calculating the error of the network’s output and then propagating this error backward through the network’s layers, adjusting the connection weights at each step to minimize the error.'>backpropagation</span> (a key method for training networks by efficiently adjusting their internal connections based on errors) revitalized neural networks. While expert systems offered distinct AI solutions for specific domains, AI also began to be integrated more subtly into technologies like early recommendation systems or vision systems for quality control on assembly lines.",
      milestones: [
        { text: "Expert Systems boom (e.g., MYCIN)", icon: "fa-solid fa-briefcase" },
        { text: "Backpropagation algorithm popularized", icon: "fa-solid fa-arrows-rotate" },
        { text: "Support Vector Machines (SVMs) developed", icon: "fa-solid fa-diagram-project" }
      ],
      factoid: "Did you know? Backpropagation, a key algorithm for training neural networks, was largely overlooked for years before gaining widespread recognition in the mid-1980s."
    },
    event4: {
      id: "event4", year: "2010s-2020", title: "Deep Learning, Big Data & Power",
      content: "<span class='key-term' title='A subset of machine learning using neural networks with many layers (hence &quot;deep&quot;), allowing them to learn complex patterns from vast amounts of data.'>Deep Learning</span> (using deep, many-layered neural networks) fueled by massive datasets ('Big Data') and powerful <span class='key-term' title='Graphics Processing Units – specialized electronic circuits originally designed for rendering images, but their parallel processing capabilities make them ideal for the computationally intensive tasks of training large AI models.'>GPUs</span> (graphics chips repurposed for AI) led to breakthroughs in image/speech recognition, <span class='key-term' title='Natural Language Processing – a field of AI that enables computers to understand, interpret, and generate human language, both text and speech.'>NLP</span> (Natural Language Processing - understanding text/speech), and game playing (like Chess and Go). The <span class='key-term' title='An annual competition (formally, the ILSVRC) that played a crucial role in advancing computer vision. Researchers used the large ImageNet dataset to train models for image classification and object detection, leading to major breakthroughs, especially with deep learning.'>ImageNet Challenge</span> breakthroughs (<a href='https://image-net.org/challenges/LSVRC/' target='_blank' rel='noopener noreferrer' class='text-sky-600 hover:underline text-sm'>learn more</a>) were particularly significant. AI became common in everyday tech like spam filters and navigation apps.",
      milestones: [
        { text: "ImageNet Challenge breakthroughs", icon: "fa-solid fa-image" },
        { text: "Rise of GPUs for AI", icon: "fa-solid fa-microchip" },
        { text: "<a href='https://en.wikipedia.org/wiki/AlphaGo' target='_blank' rel='noopener noreferrer' class='text-sky-600 hover:underline'>AlphaGo</a> defeats Go champion", icon: "fa-solid fa-chess-board" }
      ],
      factoid: "Did you know? GPUs, originally designed for graphics, turned out to be exceptionally well-suited for the parallel computations required by deep learning, accelerating progress immensely."
    },
    event5: {
      id: "event5", year: "2020s+", title: "The Generative Boom",
      content: "Powerful <span class='key-term' title='AI models capable of generating new content, such as text, images, audio, or video, based on the patterns and structures learned from training data.'>Generative AI</span> models (based on architectures like <span class='key-term' title='A highly influential neural network architecture introduced in the paper &quot;Attention Is All You Need.&quot; Transformers use a mechanism called &quot;self-attention&quot; to weigh the significance of different parts of input data (like words in a sentence), making them exceptionally powerful for tasks like language translation, text generation, and understanding.'>Transformers</span>, the basis for many modern language models like GPT and Gemini) emerged, capable of creating human-like text, images, code, and more, transforming industries and sparking public imagination.",
      milestones: [
        { text: "'Attention Is All You Need' (Transformers paper)", icon: "fa-solid fa-file-lines" },
        { text: "Emergence of GPT models", icon: "fa-solid fa-pen-fancy" },
        { text: "Diffusion models for image generation", icon: "fa-solid fa-palette" }
      ],
      factoid: "Did you know? The 'Transformer' architecture, introduced in 2017, is the foundation for many of today's most powerful large language models, including GPT and Gemini."
    }
  };
  placeholder.innerHTML = `
    <div class="timeline-container-enhanced">
      <div class="timeline-line"></div>
      <div class="timeline-items-wrapper hide-scrollbar needs-swipe-hint">
        <div class="timeline-items" id="timeline-items-container">
        </div>
      </div>
    </div>
    <div id="details-container" class="details-section">
      <h3 id="details-title" class="font-semibold text-xl mb-2">Explore the Timeline</h3>
      <p id="details-content" class="text-sm mb-3">Click an era above (like '1950s' or '2020s+') to learn more about key AI developments.</p>
      <div id="details-milestones" class="mb-3"></div>
      <div id="details-factoid"></div>
    </div>
  `;
  const timelineItemsContainer = document.getElementById('timeline-items-container');
  if (!timelineItemsContainer) return;
  Object.values(eventDetails).forEach(event => {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'timeline-item group';
    itemDiv.setAttribute('data-id', event.id);
    itemDiv.innerHTML = `<div class="timeline-point-enhanced"></div><span class="timeline-label">${event.year}</span>`;
    itemDiv.addEventListener('click', () => updateTimelineDetails(event.id, eventDetails));
    timelineItemsContainer.appendChild(itemDiv);
  });
  if (Object.keys(eventDetails).length > 0) {
    updateTimelineDetails(Object.keys(eventDetails)[0], eventDetails);
  }
}

function updateTimelineDetails(eventId, eventDetails) {
  const details = eventDetails[eventId];
  const detailsTitle = document.getElementById('details-title');
  const detailsContent = document.getElementById('details-content');
  const detailsMilestones = document.getElementById('details-milestones');
  const detailsFactoid = document.getElementById('details-factoid');
  if (details && detailsTitle && detailsContent && detailsMilestones && detailsFactoid) {
    detailsTitle.textContent = details.title + ` (${details.year})`;
    detailsContent.innerHTML = details.content;
    detailsMilestones.innerHTML = '';
    if (details.milestones && details.milestones.length > 0) {
      const milestonesTitleEl = document.createElement('h4');
      milestonesTitleEl.className = 'font-medium text-md text-slate-800 mb-1';
      milestonesTitleEl.textContent = 'Key Milestones:';
      detailsMilestones.appendChild(milestonesTitleEl);
      const list = document.createElement('ul');
      list.className = 'milestones-list text-sm';
      details.milestones.forEach(milestone => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `<i class="${milestone.icon || 'fa-solid fa-star'}"></i> ${milestone.text}`;
        list.appendChild(listItem);
      });
      detailsMilestones.appendChild(list);
    }
    detailsFactoid.innerHTML = '';
    if (details.factoid) {
      const factoidP = document.createElement('p');
      factoidP.className = 'factoid text-sm';
      factoidP.innerHTML = `<i class="fa-solid fa-circle-info mr-2"></i> ${details.factoid}`;
      detailsFactoid.appendChild(factoidP);
    }
    document.querySelectorAll('.timeline-item').forEach(item => {
      item.classList.remove('active');
      if (item.getAttribute('data-id') === eventId) {
        item.classList.add('active');
      }
    });
    const detailsContainer = document.getElementById('details-container');
    if(detailsContainer) detailsContainer.scrollTo({ top: 0, behavior: 'smooth' });
    if (!state.timelineInteractedS3) {
        state.timelineInteractedS3 = true;
        saveState();
		const notice = document.querySelector('#section-3-unlock');
		if (notice) notice.remove();        // removes “please explore timeline” text
		updateNavButtons();                 // so the NEXT button lights up

        if (state.currentSectionId === 3) {
        }
    }
  } else {
    console.error("Could not find all elements needed to update timeline details.");
  }
}

function updateNavButtons() {
  const currentIndex = sections.findIndex(s => String(s.id) == String(state.currentSectionId));
  prevBtn.disabled = currentIndex === 0;
  const currentSection = sections[currentIndex];
  let canProceed = true;
  if (currentSection) {
    if (currentSection.id !== 1 && currentSection.quiz && !state.quizResults[currentSection.id]?.completed) {
      canProceed = false;
      if (currentSection.id === 3 && !state.timelineInteractedS3) {
        canProceed = false;
      }
    }
    if (currentSection.id === 'final-quiz' && !state.finalQuizCompleted) {
      canProceed = false;
    }
    if (state.currentSectionId === 10 && state.quizResults[10]?.completed) {
        canProceed = true;
    }
    if (state.currentSectionId === 11) {
        canProceed = true;
    }
  }
  nextBtn.classList.toggle('hidden', state.currentSectionId === 1 || state.currentSectionId === 'certificate');
  prevBtn.classList.toggle('hidden', state.currentSectionId === 1);
  const previousSectionIndex = currentIndex > 0 ? currentIndex -1 : -1;
  const previousSection = previousSectionIndex !== -1 ? sections[previousSectionIndex] : null;
  const shouldHighlight = previousSection &&
                          previousSection.quiz &&
                          state.quizResults[previousSection.id]?.completed &&
                          canProceed && 
                          currentIndex < sections.length - 1; 
  nextBtn.classList.toggle('highlight-next', shouldHighlight);
  nextBtn.disabled = currentIndex === sections.length - 1 || !canProceed;
}

function updateSidebarActive() {
  getSidebarLinks().forEach(link => {
    const sectionId = link.getAttribute('data-section');
    if (sectionId == String(state.currentSectionId)) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    } else {
      link.classList.remove('active');
      link.removeAttribute('aria-current');
    }
  });
}
function navigateToSection(sectionId) {
  stopAudio();
  removeAudioPrefetch();
  const targetSectionId = String(sectionId);
  const targetIndex = sections.findIndex(s => String(s.id) === targetSectionId);
  if (targetIndex < 0) {
    console.error("Target section not found:", targetSectionId);
    return;
  }
  state.currentSectionId = sections[targetIndex].id;
  renderSection(state.currentSectionId);
  saveState();
  if (window.innerWidth < 768 && !sidebar.classList.contains('-translate-x-full')) {
    sidebar.classList.add('-translate-x-full');
  }
  contentArea.scrollTop = 0;
  nextBtn.classList.remove('highlight-next');
}

let currentQuizId = null;
let currentQuizAnswers = {};
let quizAttempted = false;

function openQuiz(quizId) {
  currentQuizId = quizId;
  const quizData = quizzes[quizId];
  if (!quizData) {
    console.error("Quiz data not found for:", quizId);
    return;
  }
  const section = sections.find(s => String(s.id) == String(quizId));
  const title = quizId === 'final-quiz' ? "Final Quiz" : `Section ${quizId}: ${section?.title} Quiz`;
  quizTitle.textContent = title;
  quizContent.innerHTML = '';
  quizAttempted = false;
  currentQuizAnswers = {};
  quizData.forEach((q, index) => {
    const questionId = `q-${quizId}-${index}`;
    const questionElement = document.createElement('div');
    questionElement.id = questionId;
    questionElement.className = 'mb-6 p-4 border border-gray-200 rounded-lg bg-white shadow-sm';
    questionElement.innerHTML = `<p class="font-medium mb-3 text-gray-800">${index + 1}. ${q.q}</p>`;
    const optionsElement = document.createElement('div');
    optionsElement.className = 'space-y-2';
    const inputName = `q${index}`;
    if (q.type === 'mc' || q.type === 'ordering_mc') {
      q.options.forEach((option, optIndex) => {
        const optionId = `${questionId}-opt${optIndex}`;
        optionsElement.innerHTML += `
          <label for="${optionId}" class="flex items-center p-3 border border-gray-300 rounded-md hover:bg-sky-50 cursor-pointer transition duration-150 ease-in-out">
            <input type="radio" id="${optionId}" name="${inputName}" value="${optIndex}" class="mr-3 focus:ring-sky-500 h-4 w-4 text-sky-600 border-gray-300">
            <span class="text-gray-700">${option}</span>
          </label>`;
      });
    } else if (q.type === 'tf') {
      const trueOptionId = `${questionId}-optTrue`;
      const falseOptionId = `${questionId}-optFalse`;
      optionsElement.innerHTML += `
        <label for="${trueOptionId}" class="flex items-center p-3 border border-gray-300 rounded-md hover:bg-sky-50 cursor-pointer transition duration-150 ease-in-out">
          <input type="radio" id="${trueOptionId}" name="${inputName}" value="true" class="mr-3 focus:ring-sky-500 h-4 w-4 text-sky-600 border-gray-300">
          <span class="text-gray-700">True</span>
        </label>
        <label for="${falseOptionId}" class="flex items-center p-3 border border-gray-300 rounded-md hover:bg-sky-50 cursor-pointer transition duration-150 ease-in-out">
          <input type="radio" id="${falseOptionId}" name="${inputName}" value="false" class="mr-3 focus:ring-sky-500 h-4 w-4 text-sky-600 border-gray-300">
          <span class="text-gray-700">False</span>
        </label>`;
    } else if (q.type === 'matching') {
      let selectOptionsHtml = `<option value="">-- Select a match --</option>`;
      const shuffledOptions = [...q.options].sort(() => Math.random() - 0.5);
      shuffledOptions.forEach(opt => {
        selectOptionsHtml += `<option value="${opt.id}">${opt.text}</option>`;
      });
      q.items.forEach((item, itemIndex) => {
        const selectId = `${questionId}-match${itemIndex}`;
        optionsElement.innerHTML += `
          <div class="matching-item">
            <label for="${selectId}" class="matching-term">${item.term}:</label>
            <select id="${selectId}" name="${inputName}-${item.id}" class="matching-select focus:ring-sky-500 focus:border-sky-500">
              ${selectOptionsHtml}
            </select>
          </div>`;
      });
    }
    questionElement.appendChild(optionsElement);
    const feedbackElement = document.createElement('div');
    feedbackElement.id = `feedback-${index}`;
    feedbackElement.className = 'mt-4 text-sm';
    questionElement.appendChild(feedbackElement);
    if (quizId === 'final-quiz' && q.sectionLink) {
        const remediationElement = document.createElement('div');
        remediationElement.id = `remediation-${index}`;
        remediationElement.className = 'mt-2 text-sm hidden';
        questionElement.appendChild(remediationElement);
    }
    quizContent.appendChild(questionElement);
  });
  submitQuizBtn.classList.remove('hidden');
  resetQuizBtn.classList.remove('hidden');
  closeQuizBtn.classList.add('hidden');
  quizModal.classList.remove('hidden');
  quizContent.scrollTop = 0;
  prefetchNextAudio(quizId);
}

function submitQuiz() {
  if (quizAttempted && currentQuizId !== 'final-quiz') return; 
  const quizData = quizzes[currentQuizId];
  let score = 0;
  let allAnswered = true;
  let firstUnansweredIndex = -1;
  quizData.forEach((q, index) => {
    const selectedAnswer = currentQuizAnswers[index];
    const feedbackEl = document.getElementById(`feedback-${index}`);
    const remediationEl = document.getElementById(`remediation-${index}`);
    feedbackEl.innerHTML = ''; 
    feedbackEl.className = 'mt-4 text-sm'; 
    if (remediationEl) remediationEl.classList.add('hidden'); 
    const questionElement = document.getElementById(`q-${currentQuizId}-${index}`);
    questionElement.querySelectorAll('label, select').forEach(el => el.classList.remove('answer-correct', 'answer-incorrect', 'border-red-400'));
    questionElement.querySelectorAll('input, select').forEach(inp => inp.disabled = false);
    let isCorrect = false;
    let isQuestionAnswered = true;
    if (q.type === 'mc' || q.type === 'tf' || q.type === 'ordering_mc') {
      if (selectedAnswer === undefined) {
        isQuestionAnswered = false;
        feedbackEl.textContent = 'Please select an answer.';
      } else {
        isCorrect = (selectedAnswer === q.answer);
        const selectedInput = questionElement.querySelector(`input[name="q${index}"][value="${q.type === 'tf' ? String(selectedAnswer) : selectedAnswer}"]`);
        if (selectedInput) {
          selectedInput.closest('label').classList.add(isCorrect ? 'answer-correct' : 'answer-incorrect');
        }
      }
    } else if (q.type === 'matching') {
      isCorrect = true; 
      if (!selectedAnswer || Object.keys(selectedAnswer).length < q.items.length || Object.values(selectedAnswer).some(val => !val)) {
        isQuestionAnswered = false;
        feedbackEl.textContent = 'Please make a selection for each item.';
        q.items.forEach((item, itemIndex) => {
            const selectEl = questionElement.querySelector(`#q-${currentQuizId}-${index}-match${itemIndex}`);
            if (selectEl && (!selectedAnswer || !selectedAnswer[item.id])) {
                selectEl.classList.add('border-red-400'); 
            } else if (selectEl) {
                selectEl.classList.remove('border-red-400');
            }
        });
      } else {
        q.items.forEach((item, itemIndex) => {
          const correctOptionId = q.answer[item.id];
          const selectedOptionId = selectedAnswer[item.id];
          const selectEl = questionElement.querySelector(`#q-${currentQuizId}-${index}-match${itemIndex}`);
          if (selectedOptionId === correctOptionId) {
            selectEl.classList.add('answer-correct');
          } else {
            selectEl.classList.add('answer-incorrect');
            isCorrect = false; 
          }
        });
      }
    }
    if (!isQuestionAnswered) {
      allAnswered = false;
      feedbackEl.className = 'mt-4 text-sm text-red-600 font-medium';
      if (firstUnansweredIndex === -1) firstUnansweredIndex = index;
      return; 
    }
    questionElement.querySelectorAll('input, select').forEach(inp => inp.disabled = true);
    if (isCorrect) {
      score++;
      let feedbackText = q.correctFeedback || '';
      if ((q.type === 'mc' || q.type === 'ordering_mc') && q.feedback && q.feedback.length > q.answer) {
        feedbackText = q.feedback[q.answer];
      }
      feedbackEl.innerHTML = `<span class="feedback-title text-green-700">Correct!</span> ${feedbackText}`;
      feedbackEl.className = 'mt-4 text-sm feedback-correct';
    } else {
      let feedbackText = '';
      if ((q.type === 'mc' || q.type === 'ordering_mc') && typeof selectedAnswer === 'number' && q.feedback && q.feedback.length > selectedAnswer) {
        feedbackText = q.feedback[selectedAnswer];
      } else if (q.type === 'tf') {
        feedbackText = q.incorrectFeedback || "That wasn't the correct answer.";
      } else if (q.type === 'matching') {
        feedbackText = q.incorrectFeedback || "One or more matches are incorrect. Please review.";
      } else {
        feedbackText = "That wasn't the correct answer. Try reviewing the section content.";
      }
      feedbackEl.innerHTML = `<span class="feedback-title text-red-700">Not Quite...</span> ${feedbackText}`;
      feedbackEl.className = 'mt-4 text-sm feedback-incorrect';
      if (remediationEl && q.sectionLink) {
          const targetSection = sections.find(s => String(s.id) == String(q.sectionLink));
          remediationEl.innerHTML = `Need a refresher? Review <a href="#" onclick="event.preventDefault(); navigateToSection(${q.sectionLink}); closeQuiz();" class="text-sky-600 hover:underline font-medium">Section ${q.sectionLink}: ${targetSection?.title || ''}</a>`;
          remediationEl.classList.remove('hidden');
      }
    }
  });
  if (!allAnswered) {
    if (firstUnansweredIndex !== -1) {
        const questionElement = quizContent.children[firstUnansweredIndex];
        questionElement?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    console.warn("Not all questions answered.");
    quizData.forEach((q, index) => {
        if (currentQuizAnswers[index] === undefined || (q.type === 'matching' && Object.keys(currentQuizAnswers[index] || {}).length < q.items.length)) {
            document.getElementById(`q-${currentQuizId}-${index}`)?.querySelectorAll('input, select').forEach(opt => opt.disabled = false);
        }
    });
    return; 
  }
  quizAttempted = true;
  const result = {
    score: score,
    total: quizData.length,
    completed: true,
    answers: { ...currentQuizAnswers } 
  };
if (currentQuizId === 'final-quiz') {
    state.finalQuizCompleted = true;
    state.quizResults[currentQuizId] = result;
    console.log(`Final Quiz Completed! Score: ${score}/${quizData.length}.`);
    // --- NEW: Unlock certificate section upon final quiz completion ---
    updateHighestUnlocked('certificate');
    // --- End of new code ---
} else {
    state.quizResults[currentQuizId] = result;
    console.log(`Section ${currentQuizId} Quiz Completed! Score: <span class="math-inline">\{score\}/</span>{quizData.length}.`);
     // --- Optional: Unlock next section immediately upon section quiz completion ---
     // Find the index of the current quiz section
     // const currentQuizIndex = sections.findIndex(s => String(s.id) === String(currentQuizId));
     // if (currentQuizIndex !== -1 && currentQuizIndex < sections.length - 1) {
     //     const nextSectionAfterQuiz = sections[currentQuizIndex + 1];
     //     updateHighestUnlocked(nextSectionAfterQuiz.id);
     // }
     // Note: Current logic unlocks on clicking 'Next', which might be preferred.
     // Uncomment above if you want unlocking upon quiz submission instead.
}

saveState(); // Save progress

// Update UI (existing code)
submitQuizBtn.classList.add('hidden');
resetQuizBtn.classList.remove('hidden');
closeQuizBtn.classList.remove('hidden');

renderSection(state.currentSectionId); // Re-render current section
updateNavButtons(); // Update navigation buttons
updateSidebarAccess(); // Ensure sidebar reflects potential unlocking
}

function resetQuiz() {
  if (currentQuizId === 'final-quiz') {
    state.finalQuizCompleted = false;
    delete state.quizResults['final-quiz']; 
  }
  saveState();
  openQuiz(currentQuizId); 
}

function closeQuiz() {
  stopAudio(); 
  quizModal.classList.add('hidden');
  currentQuizId = null;
  renderSection(state.currentSectionId);
}

function generateCertificate() {
  const nameInput = document.getElementById('certificateName');
  const outputDiv = document.getElementById('certificateOutput');
  const userName = nameInput.value.trim();
  if (!userName) {
    alert("Please enter your name for the certificate.");
    nameInput.focus();
    return;
  }
  state.userName = userName; 
  saveState();
  const dateFormatter = new Intl.DateTimeFormat(undefined, {
    year: 'numeric', month: 'long', day: 'numeric'
  });
  const completionDate = dateFormatter.format(new Date());
  outputDiv.innerHTML = `
    <div class="border-8 border-double border-sky-600 p-8 bg-gradient-to-br from-sky-50 to-blue-100 rounded-lg shadow-xl relative">
      <div class="absolute top-4 left-4 text-sky-400 text-3xl opacity-50"><i class="fas fa-certificate"></i></div>
      <div class="absolute bottom-4 right-4 text-sky-400 text-3xl opacity-50 transform rotate-12"><i class="fas fa-graduation-cap"></i></div>
      <h2 class="text-3xl md:text-4xl font-bold text-sky-800 mb-5 tracking-tight">Certificate of Completion</h2>
      <p class="text-lg text-gray-700 mb-3">This certifies that</p>
      <p class="text-2xl md:text-3xl font-semibold text-indigo-700 mb-4 break-words border-b-2 border-indigo-200 pb-2 inline-block">${userName}</p>
      <p class="text-lg text-gray-700 mb-3">has successfully completed the</p>
      <p class="text-xl md:text-2xl font-medium text-gray-800 mb-6">AI Training Module for Elementary Teachers</p>
      <div class="w-1/3 h-1 bg-sky-300 mx-auto my-8 rounded"></div>
      <p class="text-base text-gray-600">Issued on: ${completionDate}</p>
      <p class="text-sm text-gray-500 mt-5 italic px-4">This module covered foundational AI concepts, practical applications in the elementary classroom, ethical considerations, and strategies for safe and responsible integration.</p>
      <button onclick="window.print()" class="mt-8 px-8 py-3 text-white bg-sky-600 rounded-lg hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 no-print transition duration-150 ease-in-out shadow-md text-lg font-medium">
        <i class="fas fa-print mr-2"></i>Print Certificate
      </button>
    </div>
  `;
  outputDiv.classList.remove('hidden');
}

let currentAudioSectionId = null; 
function updateAudioPlayerButton(button, isPlaying, isPaused) {
    if (!button) return;
    if (isPlaying && !isPaused) {
        button.innerHTML = '<i class="fas fa-pause mr-1"></i> Pause Audio';
        button.classList.add('playing');
        button.classList.remove('paused');
        button.title = "Pause audio playback";
    } else if (isPlaying && isPaused) { 
        button.innerHTML = '<i class="fas fa-play mr-1"></i> Resume Audio';
        button.classList.add('paused');
        button.classList.remove('playing');
        button.title = "Resume audio playback";
    } else { 
        button.innerHTML = '<i class="fas fa-play mr-1"></i> Listen';
        button.classList.remove('playing', 'paused');
        button.title = "Listen to section audio";
    }
}

function stopAudio() {
    if (sectionAudioPlayer && !sectionAudioPlayer.paused) {
        sectionAudioPlayer.pause();
        sectionAudioPlayer.currentTime = 0; 
        console.log("Audio stopped.");
    }
    currentAudioSectionId = null; 
    document.querySelectorAll('.audio-player-btn').forEach(btn => updateAudioPlayerButton(btn, false, false));
}

function toggleAudioPlayback(button, sectionId) {
    const audioSrc = sectionAudio[sectionId];
    if (!audioSrc) {
        console.error("No audio source found for section:", sectionId);
        alert("Audio not available for this section.");
        return;
    }
    if (currentAudioSectionId !== null && currentAudioSectionId !== sectionId) {
        stopAudio(); 
    }
    if (sectionAudioPlayer.src !== audioSrc || (sectionAudioPlayer.paused && sectionAudioPlayer.currentTime === 0)) {
        sectionAudioPlayer.src = audioSrc;
        currentAudioSectionId = sectionId; 
        sectionAudioPlayer.load();
        sectionAudioPlayer.play().then(() => {
            updateAudioPlayerButton(button, true, false);
            console.log("Audio playing:", audioSrc);
        }).catch(error => {
            console.error("Audio play failed:", error);
            alert("Could not play audio. Please check console for errors.");
            updateAudioPlayerButton(button, false, false);
            currentAudioSectionId = null;
        });
    } else if (sectionAudioPlayer.paused) {
        sectionAudioPlayer.play().then(() => {
            updateAudioPlayerButton(button, true, false);
            console.log("Audio resumed.");
        }).catch(error => {
            console.error("Audio resume failed:", error);
            updateAudioPlayerButton(button, false, false);
        });
    } else {
        sectionAudioPlayer.pause();
        updateAudioPlayerButton(button, true, true); 
        console.log("Audio paused.");
    }
    sectionAudioPlayer.onended = () => {
        console.log("Audio ended.");
        updateAudioPlayerButton(button, false, false);
        currentAudioSectionId = null; 
    };
    sectionAudioPlayer.onerror = (e) => {
        console.error("Audio player error:", e);
        alert("An error occurred while trying to play the audio.");
        updateAudioPlayerButton(button, false, false);
        currentAudioSectionId = null;
    };
}

function removeAudioPrefetch() {
    const existingPrefetch = document.getElementById('audio-prefetch-link');
    if (existingPrefetch) {
        existingPrefetch.remove();
    }
}

function prefetchNextAudio(currentQuizSectionId) {
    removeAudioPrefetch(); 
    const currentSectionIndex = sections.findIndex(s => String(s.id) === String(currentQuizSectionId));
    if (currentSectionIndex === -1 || currentSectionIndex >= sections.length - 1) return; 
    const nextSection = sections[currentSectionIndex + 1];
    if (nextSection && nextSection.id) { 
        const nextAudioSrc = sectionAudio[nextSection.id];
        if (nextAudioSrc) {
            const prefetchLink = document.createElement('link');
            prefetchLink.id = 'audio-prefetch-link'; 
            prefetchLink.rel = 'prefetch';
            prefetchLink.href = nextAudioSrc;
            prefetchLink.as = 'audio';
            document.head.appendChild(prefetchLink);
            console.log("Prefetching audio for section:", nextSection.id, nextAudioSrc);
        }
    }
}
