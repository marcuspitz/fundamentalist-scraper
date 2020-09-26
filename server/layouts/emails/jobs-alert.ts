export const HTML: string = `
<div width="100%" style="
    margin:0;
    padding:0!important;>
    <div>
        <table aria-hidden="true" border="0" cellpadding="0" cellspacing="0" role="presentation" style="max-width:680px;width:100%;">
        <tbody>
            <tr>
            <td style="text-align:left">
                <a href="<%- host %>">
                    <img src="<%- host %>/assets/img/brand/logo.png" 
                    alt="Remote Tech Jobs" border="0" height="27" width="171" 
                    style="
                    display:block;
                    font-family:arial,sans-serif;
                    font-size:15px;
                    line-height:15px;
                    color:#3c3f44;
                    margin:0">
                </a>
            </td>
            </tr>
            <% if (topJobs.length > 0) { %>
            <tr>
                <td style="padding-top: 20px;" bgcolor="#ffffff" align="left" valign="top">
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" align="left" width="100%">
                    <tbody>
                        <tr>
                        <td align="center" valign="top" 
                        style="
                        background-image: linear-gradient(to right, #5779bd, #2861d5 98%);
                        font-size:0;
                        text-align:left;
                        border-top:1px solid #e9eaec;
                        border-bottom:1px solid #e9eaec">
                            <div style="display:inline-block;vertical-align:top;width:100%;text-align:left" class="m_5529906232601299340stack-column">
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                <tbody>
                                <tr>
                                    <td style="padding:5px 20px">
                                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                        <tbody>
                                        <tr>
                                            <td style="font-family:arial,sans-serif;
                                            font-size:16px;line-height:24px;
                                            color:#FFF;padding:10px 0;text-align:left">
                                            <% if (locals.techs && locals.techs.length > 0) { %>
                                                <b>Top <%- techs.join(' / ') %> jobs</b>
                                            <% } else { %>
                                                <b>Top jobs</b>
                                            <% } %>
                                            </td>
                                        </tr>
                                        </tbody>
                                    </table>
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                            </div>
                        </td>
                        </tr>
                    </tbody>
                    </table>
                </td>
            </tr>
            <% } %>
            <% topJobs.forEach(job => { %>
            <tr>
                <td align="center" valign="top" style="background-color:white">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                    <tbody>
                    <tr>
                        <td style="padding:5px 0">
                        <table role="presentation" aria-hidden="true" cellpadding="0" cellspacing="0" border="0" width="100%">
                            <tbody>
                            <tr>
                                <td>
                                <table role="presentation" aria-hidden="true" cellpadding="0" cellspacing="0" border="0" width="100%">
                                    <tbody>
                                    <tr>
                                        <td bgcolor="#ffffff" style="padding:0px 0 2px 0;font-size:15px;font-family:arial,sans-serif;line-height:23px;color:#54595f;text-align:left">
                                        <a href="<%- host %>/<%- job.mainCategory %>/<%- job.id %>/<%- job.normalizedTitle %>" style="color:#0077cc;text-decoration:none"><%- job.title %></a>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td bgcolor="#ffffff" style="padding:0 0 0 0;font-size:13px;font-family:arial,sans-serif;font-weight:400;line-height:17px;color:#54595f;text-align:left">
                                        <%- job.company.name %>
                                        </td>
                                    </tr>
                                    <% if (job.categories.length > 0) { %>
                                        <tr>
                                            <td style="font-size:13px;font-family:arial,sans-serif;font-weight:400;line-height:17px;color:#54595f;">
                                                <%- job.categories.map(c => c.category).join(' / ') %>
                                            </td>
                                        </tr>
                                    <% } %>
                                    </tbody>
                                </table>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                        </td>
                    </tr>                                                      
                    </tbody>
                </table>
                </td>
            </tr>
            <% }); %>
            <% if (otherJobs.length > 0) { %>

                <% if (topJobs.length > 0) { %>
                    <tr>
                        <td style="
                        padding-top: 20px;
                    "></td>
                    </tr>
                <% } else { %>
                    <tr>
                        <td style="
                        padding-top: 20px;
                    "></td>
                    </tr>
                <% } %>
            <tr>
                <td bgcolor="#ffffff" align="left" valign="top">
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" align="left" width="100%">
                    <tbody>
                        <tr>
                        <td align="center" valign="top" 
                        style="
                        background-image: linear-gradient(to right, #9b9b9c, #8e8f90 98%);
                        font-size:0;
                        text-align:left;
                        border-top:1px solid #e9eaec;
                        border-bottom:1px solid #e9eaec">
                            <div style="display:inline-block;vertical-align:top;width:100%;text-align:left" class="m_5529906232601299340stack-column">
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                <tbody>
                                <tr>
                                    <td style="padding:5px 20px">
                                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                        <tbody>
                                        <tr>
                                            <td style="font-family:arial,sans-serif;
                                            font-size:16px;line-height:24px;
                                            color:#FFF;padding:10px 0;text-align:left">
                                            <% if (locals.techs && locals.techs.length > 0) { %>
                                                <b>All <%- techs.join(' / ') %> jobs</b>
                                            <% } else { %>
                                                <b>All jobs</b>
                                            <% } %>                                            
                                            </td>
                                        </tr>
                                        </tbody>
                                    </table>
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                            </div>
                        </td>
                        </tr>
                    </tbody>
                    </table>
                </td>
            </tr>
            <% } %>
            <% otherJobs.forEach(job => { %>
            <tr>
                <td align="center" valign="top" style="background-color:white">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                    <tbody>
                    <tr>
                        <td style="padding:5px 0">
                        <table role="presentation" aria-hidden="true" cellpadding="0" cellspacing="0" border="0" width="100%">
                            <tbody>
                            <tr>
                                <td>
                                <table role="presentation" aria-hidden="true" cellpadding="0" cellspacing="0" border="0" width="100%">
                                    <tbody>
                                    <tr>
                                        <td bgcolor="#ffffff" style="padding:0px 0 2px 0;font-size:15px;font-family:arial,sans-serif;line-height:23px;color:#54595f;text-align:left">
                                        <a href="<%- host %>/<%- job.mainCategory %>/<%- job.id %>/<%- job.normalizedTitle %>" style="color:#0077cc;text-decoration:none"><%- job.title %></a>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td bgcolor="#ffffff" style="padding:0 0 0 0;font-size:13px;font-family:arial,sans-serif;font-weight:400;line-height:17px;color:#54595f;text-align:left">
                                        <%- job.company.name %>
                                        </td>
                                    </tr>
                                    <% if (job.categories.length > 0) { %>
                                        <tr>
                                            <td style="font-size:13px;font-family:arial,sans-serif;font-weight:400;line-height:17px;color:#54595f;">
                                                <%- job.categories.map(c => c.category).join(' / ') %>
                                            </td>
                                        </tr>
                                    <% } %>
                                    </tbody>
                                </table>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                        </td>
                    </tr>                                                      
                    </tbody>
                </table>
                </td>
            </tr>
            <% }); %>
            <tr>
                <td style="
                font-family: Arial,sans-serif;
                color: #606d76;
                font-size: 12px;">
                <% const describedTechs = (locals.techs && locals.techs.length > 0) ? techs.join(' / ') + ' ' : ' '; %>
                    <p>You signed up to receive a daily email of all new <%- describedTechs %>jobs on <a style="color: #606d76;text-decoration: underline;" href="<%- alertEndPoint %>">Remote Tech Jobs</a>. <a href="<%- unsubscribeEndpoint %>" 
                    style="color: #606d76;text-decoration: underline;">Unsubscribe from these <%- describedTechs %>job alerts.</a></p>
                </td>
            </tr>
            <tr>
                <td bgcolor="#ffffff" align="left" valign="top">
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" align="left" width="100%">
                    <tbody>
                        <tr>
                        <td align="center" valign="top" style="
                        font-size:0;
                        text-align:left;">
                            <div style="display:inline-block;vertical-align:top;width:100%;text-align:left" class="m_5529906232601299340stack-column">
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                <tbody>
                                <tr>
                                    <td style="padding:5px 20px">
                                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                        <tbody>
                                        <tr>
                                            <td style="font-family:arial,sans-serif;font-size:16px;font-size:13px;line-height:24px;color:#52575c;padding:10px 0;text-align:left">                                        
                                            </td>
                                        </tr>
                                        </tbody>
                                    </table>
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                            </div>
                        </td>
                        </tr>
                    </tbody>
                    </table>
                </td>
            </tr>          
        </tbody>
        </table>
    </div>
</div>
`;