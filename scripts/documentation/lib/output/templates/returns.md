<div class="method-list">
  <table>
    <thead>
      <tr>
        <th>RETURN VALUE</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      <% data.forEach(param => { %><tr>
        <td class="param">
          <code><%- param.name %></code><% if (param.type) { %><span class="type"><%- param.type %></span class="type"><% } %>
        </td>
        <td><%- param.description %></td>
      </tr><% }) %>
    </tbody>
  </table>
</div>
