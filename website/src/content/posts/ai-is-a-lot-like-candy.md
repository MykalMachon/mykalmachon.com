---
pubDate: 2025-06-18
title: AI is a lot like candy
type: post
draft: false
tags: ['ai', 'opinion']

---
I just read [this article](https://time.com/7295195/ai-chatgpt-google-learning-school/) and the linked [MIT study](https://www.media.mit.edu/publications/your-brain-on-chatgpt/) (TLDR: people "using AI consistently underperformed at neural, linguistic, and behavioral levels" in testing) over my lunch break. It confirmed a thought I've been having quite often lately; we should probably think of AI a lot like we think of candy. *A nice sweet treat every once in a while, but not something that should make up the majority of your diet.*&#x20;

I think this approach is especially important for those of us who's work can easily be augmented or in some cases replaced by existing AI tools: Software Developers, Systems Analysts, Writers, Academics, etc. Eating candy feels really good, but we know why it shouldn't be the majority of our diet. In the same way, having an AI write your code feels very productive, but the gains are often shallow, and the losses cut deeper than you might realize.

## The first hint of my candy addiction

Around 6 months ago when I setup a new computer that didn't have copilot on it yet. I noticed that I was typing a few characters then, without thinking about it, waiting for code completions. I hadn't even thought about how I was going to implement the function past the first line because I had wired my brain to expect an AI to take a first pass.&#x20;

I turned off copilot's inline code completions then and have had them off 95% of the time since then. This felt like a good compromise to me, and I kept on working.

## When I realized I had a problem

After I turned off code completions, I started using GitHub Copilot's "Edit" and "Agent" modes for very specific work. Some generalized examples of when I was using this mode are:&#x20;

1. I had already written all the core logic for a function but wanted to abstract the business logic into re-usable functions so that the core entry point functions were easier to read.&#x20;
2. I manually abstracted bare fetch calls into an API wrapper and wanted to replace all of my API calls with wrapper calls.&#x20;

For a few months this was going well. I felt like I was shipping more code. I thought I was understanding the code I was shipping and more importantly I *thought* everything was working.&#x20;

### Issues with my 1st use case&#x20;

AI is really great at solving the task you put in front of it. When I asked for it to break out my business logic into smaller re-usable functions it did just that. What it wasn't able to do, which in retrospect should have been obvious, was predict how I wanted to use those functions moving forward or think about *why* I'd want things broken out.&#x20;

The code Copilot generated for me was sort of like this:&#x20;

```typescript
// all the definitions for our functions
const getGroupInfo = (groupData: GroupData): GroupInfo
const getItemsForGroup = async (groupData: GroupData): Promise<Item[]>
const getSectionsForGroup = async (groupData: GroupData): Promise<Section[]>
const createNewGroup = async (items: Item[]): Promise<Group>
const addSectionsToGroup = async (id: string, sections: Section[]): Promise<void>

// the main business function
const importGroup = async (deps, rawGroupData) => {
  const { logger, database, cache, api } = deps;

  const { groupName, groupCode } = getGroupInfo(rawGroupData);

  const items = await getItemsForGroup(rawGroupData);
  const sections = await getSectionsForGroup(rawGroupData);

  const newGroup = await createNewGroup(newGroup.items);
  await addSectionsToGroup(newGroup.id, sections);

  return newGroup;
}
```

This looks great! what the AI didn't realize is that groups are actually a more specific version of another type called an organization in the API I was using. Every action we're taking in block of code could also be taken on an Organization with exception to managing sections. Only groups can have sections.

So, while the AI did a good job of solving for what it could see in the codebase, it didn't do what I would have done. Because I've been working with these APIs and this codebase for a while, I know about the Organization and Group relationship. If I would have written this code, I would have abstracted things out either into classes for Organizations and Groups with proper inheritance OR used more generic types and interfaces so that these functions could be used on both organizations AND groups moving forward.

I ended up rewriting this code again and using extended types to solve this and it probably would have just been faster if I had sat down, thought about it for a few minutes, and done this from the start.&#x20;

### Issues with my 2nd use case

Fast forward to last week, one of the systems I was working on was logging a whole lot more 404s to a specific route… weird!&#x20;

Turns out, copilot had implemented one of my wrapper functions (from point number 3 above) incorrectly. Let's look at some code as an example:&#x20;

```typescript
// the old line of code 
const removedItem = await fetch(`/api/${v}/groups/${group.id}/items/${item.id}`, {
  method: 'DELETE',
  headers: { /* some stuff */ }
});

// the new line that copilot wrote a few weeks ago.
const removedItem = await myApiClient.removeItemFromGroup(item.id, group.id);
```

That all looks fine right? well what if I told you this was the function signature for that new API client call `myApiClient.removeItemFromGroup(groupId: string, itemId: string) => Promise<Item>`

***Are you seeing where the problem is?***&#x20;

This is a mistake that I am 99% sure I would not have made if I wasn't using AI. When I'm actually writing code, I read the function signature immediately before filling out parameters. I stupidly thought the AI would be smart enough to infer and interpret the function signature and the local variables correctly and was unfortunately wrong.

### Where I went wrong here

While AI did screw up in both cases here, I think the root of the issue is that I didn't understand the code that I was merging into main, and I didn't think about it because it was so easy not to! ***That's still my responsibility.***&#x20;

When I am writing code, I typically understand what it's doing because *I* thought about it before I wrote it; AI use takes that away. When I'm doing code review, I *know* I didn't write it. I take a deeper look at things. When using AI agents on my machine that same skepticism doesn't kick in. I shouldn't have trusted this code, I didn't write it, but because it was written on my machine, while I watched, that code-review instinct did not kick in. *This is undoubtedly bad.*&#x20;

## When I allow myself to have a little AI treat&#x20;

To reference back to the AI is like candy metaphor, I do still think there's a little room for it in your knowledge-worker diet. Here's what I'm currently trying:&#x20;

* **Using AI agents to write code with well-defined test in-place**: not all software is easily testable like this, but if I can define solid tests for a feature or set of functions (given this input, produce this output) agents are pretty solid at iteratively building and running against the test suite until they find a working solution.&#x20;
* **Automating very small changes**: I have had some success with AI agents or "edit mode" in Copilot when you give them a very well-defined issue or bug as well as some test cases to work with. Even then, it seems very hit or miss so far.&#x20;
* **Code Review:** One use case I have actually really enjoyed is GitHub Copilot's code review features. Whenever I submit a PR for review, Copilot will go over my code and actually submit a code review. That includes finding nitpicks, stylistic issues, or just straight up errors. Sometimes it's off base but I've actually had it catch 3-4 bugs on open PRs so far after only a few weeks.&#x20;
