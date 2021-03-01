#Twitter Typeahead
Twitter ComposeBox with typeahead feature, autocomplete username will be triggered on @

Node v12.18.4
npm 6.14.6
"react": "^17.0.1",
"react-dom": "^17.0.1"

Components Structure:
App 
  -Compose
        -ProfileHeader
        -TwitEditor
            -UserSuggestions
                -UserItem
            

# Possible improvements
1. Refactor handleKeyDown
2. Other suggestion triggers could be added ('#')
3. Use global state (redux, Context) instead of props
4. use Sass instead of plain CSS
5. Add & Improve test cases
6. Lazy loading components using Suspense, React.lazy
