---
title: 'AOC 2022: Solution for Day 4'
customSlug: aoc-2022-day-4
type: 'post'
description: My solution for advent-of-code day 4
pubDate: 2022-12-05
tags: ['tech']
draft: false

---
[Advent of code challenge #4](https://adventofcode.com/2022/day/4) is done and dealt with!

These last two challenges have been the first time I've used any sort of discrete math since university. Given all the discrete logic I've crammed into my brain from school, distilling these problems down to simple set math has made them quite a bit easier to work through. 

Here's my solution for part 1 and part 2 of day 4's challenge:

```python
"""
https://adventofcode.com/2022/day/4

steps for part 1 of today's challenge:
1. break input down into lines ("pairs of elves")
2. look at each pair and create ranges based on assignments
3. use sets to find if either set is a subset of the other 
4.1 if either of the sets are subsets, return True, else False.
1. return the sum of sets that are subsets of their pair.

steps for part 2 of today's challenge:
1. use steps 1-2 of the above
2. use sets to find if the two elements are disjoint.
2.1 if the sets are disjoint, there is no overlap, there is if they are
3. return the sum of sets with any intersect across pairs.
"""

from typing import List, Tuple
from functools import reduce


def load_input():
    """loads inputs from a local text file"""
    with open('./input.txt', 'r', encoding='utf-8') as file:
        return [line.strip('\n') for line in file.readlines()]


def get_range_pairs(lines: List[str]) -> List[Tuple]:
    """gets pairs of range from the list"""
    range_pairs = []
    for line in lines:
        items = line.split(',')
        item_range_strs = [item.split('-') for item in items]
        item_range_iter = [range(int(r[0]), int(r[1])+1)
                           for r in item_range_strs]
        item_ranges = [{x for x in r} for r in item_range_iter]
        range_pairs.append(item_ranges)
    return range_pairs


def find_subsets(pairs: List[List[int]]):
    """find pairs where either subset is a pair of itself
    This indicates a complete overlap of duties.
    """
    subsets = []
    for pair in pairs:
        if pair[0].issubset(pair[1]) or pair[1].issubset(pair[0]):
            subsets.append(True)
        else:
            subsets.append(False)
    return subsets


def find_overlap(pairs: List[List[int]]):
    """find pairs where there is any overlap at all
    """
    overlaps = []
    for pair in pairs:
        if pair[0].isdisjoint(pair[1]):
            overlaps.append(False)
        else:
            overlaps.append(True)
    return overlaps


if __name__ == "__main__":
    print("starting AOC 2022 Day 04")
    input = load_input()

    # part 1: find subset overlaps
    pairs = get_range_pairs(input)
    subset_overlap = find_subsets(pairs)
    subset_overlap_sum = reduce(
        lambda a, c: a+1 if c is True else a, subset_overlap, 0)
    print(f"there are {subset_overlap_sum} completely overlapping schedules")

    # part 2: find any overlaps at all
    overlap = find_overlap(pairs)
    overlap_sum = reduce(lambda a, c: a+1 if c is True else a, overlap, 0)
    print(f"there are {overlap_sum} partially overlapping schedules")
```

I'm still a day behind on challenges. I'm hoping to get caught up and complete challenge no. 5 tonight.