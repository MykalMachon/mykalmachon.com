---
title: 'AOC 2022: Solution for Day 6'
customSlug: aoc-2022-day-6
type: 'post'
description: My solution for advent-of-code day 6
pubDate: 2022-12-06
tags: ['tech']
draft: false

---
Advent of Code, day 6, is done! This was another quick one.

```python
    """
    Advent of code day 6:
    not writing a set of steps for this one because I 
    already got it in my head 😎 
    """
    from collections import Counter
    
    
    def load_file():
        """load file in from input.txt
        """
        with open('./input.txt', 'r') as file:
            return file.read().replace('\n', '')
    
    
    def string_has_unique_chars(string: str) -> bool:
        """check if a string has all unique characters
        """
        frequency = Counter(string)
        return len(frequency) == len(string)
    
    
    def find_packet_start(buffer: str, start_size=4) -> str:
        """find the start of a packet where the start signifier 
        is a string in the buffer of size start_size. 
        """
        window = ""
        for idx, char in enumerate(buffer):
            # setup the window
            if len(window) >= start_size:
                window = window[:start_size-1]
            window = char + window
            # if string is a valid size, check for unique
            if len(window) == start_size:
                is_unique = string_has_unique_chars(window)
                if is_unique:
                    return idx + 1
    
    
    if __name__ == "__main__":
        data = load_file()
        # part 1
        packet_start = find_packet_start(data)
        print(f"Packet starts at character {packet_start}")
    
        # part 2
        message_start = find_packet_start(data, start_size=14)
        print(f"Message starts at character {message_start}")
```
