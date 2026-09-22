# Shared tabs folder

Drop your own `.gp`, `.gp3`, `.gp4`, `.gp5`, `.gp7`, or `.gpx` files directly
into this folder (or point `docker-compose.yml`'s `tabs-server` volume at a
different folder/network share entirely — see the comment there).

The `tabs-server` Docker service lists and serves whatever is in here to the
app's Songs → Tabs page. This is a plain read-only file listing, not a
database — nothing here is scraped or fetched from anywhere; it only ever
serves files an operator (you) put here.

Files in this folder are ignored by git (see `.gitignore`) since tab files
are typically not something you want committed to source control.
