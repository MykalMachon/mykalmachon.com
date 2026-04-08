---
title: 'AOC 2022: Solution for Day 1'
customSlug: aoc-2022-day-1
type: 'post'
description: My solution for Advent of Code 2022 Day 1
pubDate: 2022-12-01
tags: ['tech']
draft: false

---
As with most years, the advent of code challenges for day one were pretty simple! Regardless, I had some fun putting together some equally simple solutions.

```python
from functools import reduce


def load_data():
    with open('./input.txt', 'r') as file:
        return file.readlines()


def calorie_by_elf(data):
    results = []
    curr_elf = 1  # id for the current elf. May need this down the line
    curr_cals = 0  # accumulator for calories on curr_elf
    for snack in data:
        if snack == "\n":
            # moving to a new elf, push crur to the results list
            results.append((curr_elf, curr_cals))
            curr_elf += 1  # move id to the next elf
            curr_cals = 0  # reset calorie accumulator
        else:
            curr_cals += int(snack)  # accumulate curr_elf calories
    return results


if __name__ == "__main__":
    data = load_data()

    # part one: find the elf carrying the most calories. How many are they carrying?
    elf_calories = calorie_by_elf(data)
    elf_calories.sort(key=lambda e: e[1], reverse=True)
    print(f"The elf with the most calories is #{elf_calories[0][0]} with {elf_calories[0][1]} calories")

    # part two: find the 3 elves with the most calories. How many are there in total?
    top_3_elves = elf_calories[0:3]
    total_calories = reduce(lambda a, c: a + c[1], top_3_elves, 0)
    print(f"The total calories carried by the top 3 elves is: {total_calories}")
```

Now let's just hope I can keep up and actually finish all the challenges this year 😅
