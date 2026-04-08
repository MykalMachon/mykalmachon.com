---
title: 'AOC 2022: Solution for Day 3'
customSlug: aoc-2022-day-3
type: 'post'
description: My solution for advent-of-code day 3
pubDate: 2022-12-05
tags: ['tech']
draft: false

---
[Today's challenge](https://adventofcode.com/2022/day/3), well uh... wasn't today's challenge 😅

I didn't write any actual code this weekend; instead opting to spend some time resting with family and friends. To be honest, I completely forgot about this challenge until about 10:30 pm today.

So, with around an hour left in the day, I took a shot at part one of Advent of Code's day 3 challenge. Check out my solution below:

```python
"""
steps for pt. 1 of today's challenge:
1. break down the rucksacks into two even pieces. 
2. parse through each of these two even pieces and find a common character
2.1 this could probably be done with a map of some sort
1. rank all of these items according to the priority system
2. sum the ranks fo all of these items
"""

from typing import List
from functools import reduce


def load_input():
    """loads inputs from a local text file"""
    with open('./input.txt', 'r', encoding='utf-8') as file:
        return [line.strip('\n') for line in file.readlines()]


def split_rucksack(rucksack: str):
    """splits a rucksack into two components
    """
    split_point = int(len(rucksack)/2)
    return [rucksack[:split_point], rucksack[split_point:]]


def get_common_items(lines: List[str]):
    """finds items that are in both compartments in each rucksack
    """
    items = []
    compartments = []
    # get the compartments to process
    for rucksack in lines:
        compartments.append(split_rucksack(rucksack))

    for idx, compartment in enumerate(compartments):
        acc = set(compartment[0])
        for item in compartment[1]:
            if {item}.issubset(acc):
                items.append(item)
                break

    return items


def get_item_priorities(items: List[str]):
    """receives a list of characters and returns their
    respective priorities given the challenges index.
    """
    new_priorities = []
    for item in items:
        is_upper = item.isupper()
        ascii_idx = ord(item.lower()) - 97
        priority = ascii_idx + 1 \
            if is_upper is False \
            else ascii_idx + 27
        new_priorities.append((item, priority))
    return new_priorities


if __name__ == "__main__":
    print("starting AOC 2022 Day 03")
    data = load_input()
    common_items = get_common_items(data)
    priorities = get_item_priorities(common_items)
    sum_of_priorities = reduce(lambda a, c: a + c[1], priorities, 0)
    print(f"Sum of priorities is: {sum_of_priorities} ")
```

Maybe I'll go back to finish part 2 a little later as it doesn't seem too challenging.