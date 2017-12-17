<% data.forEach(example => { %>
<% if (example.title === 'example') { %>
```javascript
<%- example.description %>
```
<% } else if (example.title === 'note') { %>
> <%- example.description %>
<% } %>
<% }) %>
