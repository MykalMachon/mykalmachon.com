---
title: "MDChat"
description: "Building a Markdown reading, AI powered, chatbot"
pubDate: 2024-01-01
type: 'post'
tags: ['ai', 'tech']
draft: false
---

AI and LLMs have been *the* hot-topic this year. [While I don't think AI systems are wholly *good*](https://mykal.codes/posts/putting-ai-back-in-the-bag/), I do tend to think that it's impossible to put tech like this "back in the bag". You can either learn what's out there and know when it may be an appropriate tool to reach for (this can also be never: crypto had no real use-case, for example), or you can operate without that knowledge and operate as normal with a possible disadvantage. 

That being said, I had some time off for the holidays this year and wanted to do some learning! What better way than to build a project centered around AI. One of my first ideas was to use an LLM to summarize my notes. I take notes in [Obsidian](https://obsidian.md) for my work and personal life everyday so I have literally hundreds of documents outlining my daily work, current projects, personal research, interests, etc that I can feed into an LLM for context.
  
## What I built 
Enter [MDChat](https://github.com/mykalmachon/mdchat): a CLI app that enables you to chat with your markdown notes. `MDChat` uses a large language model (LLM) and a method called "Retrieval Augmented Generation" to allow you to have conversations with an artificially intelligent "expert" on your markdown notes. While initially I built out `MDChat` for use with my personal notes, I've started using it to "chat with" large manuals and library documentation as well.

### My general approach 
I built `MDChat` out as an CLI app. I spend a good amount of my work day in a terminal and I figured it'd be nice to be able to spin-up a chat there. I also wanted to keep the UI/UX work minimal as I wanted to focus on learning about and implementing the LLM pieces. 

I did a bunch of reading on GitHub ([made a list of useful AI repos](https://github.com/stars/MykalMachon/lists/ai-tooling)), The [OpenAI website](https://cookbook.openai.com/), Mastodon, etc. I learned a lot about how LLM-powered systems work at a surface level, and I got familiar with how people are building with them.

I learned that finding and feeding relevant information into an LLM in your prompt so it can generate answers based on that specialized knowledge is generally known as "Retrieval Augmented Generation" or RAG for short[^1]. I also learned that there are a *lot* of projects out there that already do this. They can range from pretty minimal[^2] to massive undertakings in collecting, formatting, normalizing, ingesting, and indexing data for a specific use-case[^3]. 

With that in mind, I decided to start simple and build up as needed.

### Tools & libraries 

Here's a brief overview of the tools I used to build MDChat, and some thoughts on how they all tie together.

- Language
  - Python: Python is huge in the AI space and I use it at work almost everyday so it seemed like an obvious choice.
- AI toolchain
  - [LangChain](https://python.langchain.com/docs/get_started/introduction): I used LangChain as a base for interacting with the LLM as they have abstracted out most of the math-y work and make it super easy to get started. [They have a great guide on building RAG applications that I loosely referenced for this project](https://python.langchain.com/docs/use_cases/question_answering/).
  - [FAISS](https://github.com/facebookresearch/faiss): I used FAISS (or "Facebook AI Similarity Search") to ingest all of my notes and build a vector based database of content and an index to search across for similarity.
  - [Open AI API](https://platform.openai.com/docs/introduction): I used the GPT-3 and GPT-4 models from OpenAI via their API for this project as they were readily available via an API and I was already pretty familiar with their API and offerings in general. 
- Testing & CI/CD
  - [Pytest](https://docs.pytest.org/en/7.4.x/): I used Pytest to build out some basic tests for the project. I've done a little bit of work with pytest before but most of my testing experience is in Jest or jest-like test libs. It was super easy to work with and automate. 
  - [GitHub Actions](https://github.com/features/actions): I used GitHub Actions to automate and standardize testing on pull-requests into the main branch and releasing new versions of the CLI onto PyPi. If you want to know more, [checkout my workflow files in the repo](https://github.com/MykalMachon/MDChat/tree/main/.github/workflows)! love some good CI/CD.
- Others
  - [Typer](https://typer.tiangolo.com/) and [Rich](https://rich.readthedocs.io/en/stable/introduction.html): Typer is an easy to use CLI library and Rich enables some of the CLI rich-text pretty-printing, spinners, and windows used in `MDChat`. 
  - [PyPi](https://pypi.org/): The de-facto package manager for python projects. I published the CLI here to make it easy to install across a wide range of machines. if you can use `pip` you can use `MDChat`

## My results
I've been using `MDChat` for a few weeks and have some notes on what I've found it useful for and where it still needs more work

### The good
  - **Strong summarization skills on specific topics**: I've used `MDChat` for summarizing and chatting with README files or documentation for specific libraries. It's also great at talking through specific topcis in a larger set of notes. The context-aware chat makes it easy to talk through a problem or questions you might have while digging into info about a library, project, or even meetings from last week.
  - **Finding not-so-obvious connections**: I've had the `MDChat` respond along the lines of "I don't know much about that, but I can see you had a meeting with *insert coworker here* on *insert date here* about a similar topic. Maybe discuss with them?".
  - **Rediscovering notes**: There have been multiple times where `MDChat` has surfaced some long forgotten blog post or research note that is relevant to what I'm "chatting" with it about.
  - **Context-aware idea generation**: I've used `MDChat` to help review specific incidents, issues, or projects and asked for advice on specific tasks. I usually get answers that reference previous projects or similar issues. This usecase in particular was pretty unexpected for me; I've been surprised by how many times `MDChat` has been helfpful in thinking through an idea.     

### The not-so-good
  - **Not great at returning sources**: It seems like around 20-30% of the time (even higher when using GPT-3) the LLM just doesn't return a source. What's often confusing is that it obviously got the information from *somewhere*, but the note just isn't included in the response as a source.
  - **Retrival and recall issues**: Sometimes `MDChat` just gives up and says it can't find information on a topic that is very obviously covered in the provided notes. This only seems to happen on "larger" sets of notes (i.e my obsidian note vault). 
    - For example, I once asked it to summarize what it knows about GitHub Actions Self-Hosted Runners. `MDChat` said it didn't have enough information to work with despite me having 3 files and almost 2000 words of WIP blog posts about the topic in my notes.
  - **Struggles without very specific instructions**: my notes are pretty wide ranging. I have daily journal style notes, reference notes for topics I'm interested in, lists of todos, blog posts, recipes, etc. If you aren't specific with what your looking for OR there isn't enough info to answer your questions, I've found `MDChat` can get a bit off topic and will start bringing up unrelated information. This seems to be more common on larger sets of notes. From what I've seen, this may be a limit of the RAG approach in general; fine-tuning might be needed for more "broad" understanding of my notes conceptually.

### Overall

I'm happy with where `MDChat` is at right now! 

I spent around a week *really digging in* on LLMs: Reading, watching videos, just generally sucking up information. During that week I started work on the CLI, got a good bit done, and then in my second week I was able to get a fully working, relatively well tested, and published CLI package out into the world.   

## Future work
While I am happy with what I have so far, there are a few more things I'd like to do with `MDChat`. I think a few changes could make it more useful and more adaptable to people's specific needs:

- **Enable the use of local LLMs**: via something like [Ollama](https://ollama.ai) if you have to keep everything local, can't legally send your notes over the OpenAI API, don't want to pay for an OpenAI API key, or just don't trust them to keep your data private as they've promised local LLMs are a great compromise! 
- **Enable further customization**: ideally users should be able to edit the default prompt that primes LLM conversations and maybe even save multiple "profiles" for different uses. 
- **Qualitative testing of the response quality**: It would be great to build some sort of standardized test suite that mesaures performance for specific types of Q&A. Right now all my notes are based on feel. Since LLM chains aren't deterministic and each request has an associated cost they can be hard to test.

I'm sure more will come up as I use the tool and continue to learn as well.

## Try it for yourself 
If you have python v3.10+ installed, at least one markdown file, and an OpenAI API key, you can try `mdchat` out right now!

Open up your terminal, install the app, do some config, and get chatting: 
```bash
# install the CLI app from PyPi
pip install mdchat

# asks for your API key, LLM of choice, and notes folder location
mdchat config

# to chat the notes folder you just set
mdchat chat 

# to chat with a specific file
mdchat chat --file "./your/file/here.md"
```

If you run into issues or have any feedback at all I'd love to hear from you!

[^1]: [a short video on RAG from IBM](https://www.youtube.com/watch?v=T-D1OfcDW1M)
[^2]: [a simple RAG setup outlined by the people over at LangChain](https://python.langchain.com/docs/use_cases/question_answering/)
[^3]: [a good overview of RAG systems and how to scale them from a talk at the OpenAI DevDay conference in 2023](https://youtu.be/ahnGLM-RC1Y?si=6O3FEPmtYsQfj3tS&t=709)