# Slate Editor mini project with list edit with tab support

# How to
Install 
> yarn install

Run
> yarn start

Then hit http://localhost:8080

# Features
- Basic rich text editor 
- Image upload from pc with valid image format
- Tab support in list, upto 3 level
- Shift-tab will decrease indent
- Save/cancel 
- Top level block limit, configurable, defaulted to unlimited, prevent save if exceeded.
- Used localStorage
- Status bar to show top level blocks and limit

# Configure block limit
 projects/rich-text/index.js

``` const plugin = BlockCountClass({blockLimit: <limit | null>}) ```