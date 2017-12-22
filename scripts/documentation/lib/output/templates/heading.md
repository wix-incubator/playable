<% 
function heading({ name, depth = 1 }) {
  return `${'#'.repeat(depth)} ${name}`;
} 
%>

<%= heading(data) %>
