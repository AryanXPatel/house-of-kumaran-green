Abandoned_Checkout.txt
Email subject
Complete your Purchase
Email body (HTML)
{% capture email_title %}
  {% if item_count == 1 %}
    You left an item in your cart
  {% else %}
    You left items in your cart
  {% endif %}
{% endcapture %}
{% capture email_body %}
  {% if billing_address.first_name %}
    {% if item_count == 1 %}
      Hi {{ billing_address.first_name }}, you added an item to your shopping cart and haven't completed your purchase. You can complete it now while it's still available.
    {% else %}
      Hi {{ billing_address.first_name }}, you added items to your shopping cart and haven't completed your purchase. You can complete it now while they're still available.
    {% endif %}
  {% else %}
    {% if item_count == 1 %}
      Hi, you added an item to your shopping cart and haven't completed your purchase. You can complete it now while it's still available.
    {% else %}
      Hi, you added items to your shopping cart and haven't completed your purchase. You can complete it now while they're still available.
    {% endif %}
  {% endif %}
{% endcapture %}

<!DOCTYPE html>
<html lang="en">
  <head>
  <title>{{ email_title }}</title>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
  <meta name="viewport" content="width=device-width">
  <link rel="stylesheet" type="text/css" href="/assets/notifications/styles.css">
  <style>
    .button__cell { background: {{ shop.email_accent_color }}; }
    a, a:hover, a:active, a:visited { color: {{ shop.email_accent_color }}; }
  </style>
</head>

  <body>
    <table class="body">
      <tr>
        <td>
          <table class="header row">
  <tr>
    <td class="header__cell">
      <center>

        <table class="container">
          <tr>
            <td>

              <table class="row">
                <tr>
                  <td class="shop-name__cell">
                    {%- if shop.email_logo_url %}
                      <img src="{{shop.email_logo_url}}" alt="{{ shop.name }}" width="{{ shop.email_logo_width }}">
                    {%- else %}
                      <h1 class="shop-name__text">
                        <a href="{{shop.url}}">{{ shop.name }}</a>
                      </h1>
                    {%- endif %}
                  </td>

                </tr>
              </table>

            </td>
          </tr>
        </table>

      </center>
    </td>
  </tr>
</table>

          <table class="row content">
  <tr>
    <td class="content__cell">
      <center>
        <table class="container">
          <tr>
            <td>
              
            <h2>{{ email_title }}</h2>
            {% if custom_message != blank %}
              <p>{{ custom_message }}</p>
            {% else %}
              <p>{{ email_body }}</p>
            {% endif %}
            <table class="row actions">
  <tr>
    <td class="empty-line">&nbsp;</td>
  </tr>
  <tr>
    <td class="actions__cell">
      <table class="button main-action-cell">
        <tr>
          <td class="button__cell"><a href="{{ url }}" class="button__text">Items in your cart</a></td>
        </tr>
      </table>
        {% if shop.url %}
    <table class="link secondary-action-cell">
      <tr>
        <td class="link__cell">or <a href="{{ shop.url }}">Visit our store</a></td>
      </tr>
    </table>
{% endif %}

    </td>
  </tr>
</table>


            </td>
          </tr>
        </table>
      </center>
    </td>
  </tr>
</table>

          <table class="row section">
  <tr>
    <td class="section__cell">
      <center>
        <table class="container">
          <tr>
            <td>
              <h3>Complete your purchase</h3>
            </td>
          </tr>
        </table>
        <table class="container">
          <tr>
            <td>
              
            
  <table class="row">
    {% for line in subtotal_line_items %}
      
{% comment %} Skip child add-ons since they will be rendered under the parent line item {% endcomment %}
{% unless line.nested_line_child? %}

  {% assign is_parent = false %}
  {% assign is_nested_line_parent = line.nested_line_parent? %}
  {% if line.bundle_parent? or line.nested_line_parent? %}
    {% assign is_parent = true %}
  {% endif %}
  {% if is_nested_line_parent %}
    {% assign css_order_list_cell_nested_line_parent_class = 'order-list__parent-cell' %}
    {% assign css_order_list_parent_image_cell_nested_line_parent_class = 'order-list__nested-parent-image-cell' %}
  {% endif %}

  <tr class="order-list__item">
    <td class="order-list__item__cell {{ css_order_list_cell_nested_line_parent_class }}">
      <table height="100%">
        <td style="padding-bottom: 0px;">
          <table height="100%">
            <tr valign="top">
              {% if true and is_parent %}
                <td class="order-list__parent-image-cell {{ css_order_list_parent_image_cell_nested_line_parent_class }}">
                  {% if line.image %}
                    <img src="{{ line | img_url: 'compact_cropped' }}" align="left" width="60" height="60" class="order-list__product-image"/>
                  {% else %}
                    <div class="order-list__no-image-cell">
                      <img src="{{ 'notifications/no-image.png' | shopify_asset_url }}" align="left" class="order-list__no-product-image"/>
                    </div>
                  {% endif %}
                </td>
              {% else %}
                <td class="order-list__image-cell">
                  {% if line.image %}
                    <img src="{{ line | img_url: 'compact_cropped' }}" align="left" width="60" height="60" class="order-list__product-image"/>
                  {% else %}
                    <div class="order-list__no-image-cell">
                      <img src="{{ 'notifications/no-image.png' | shopify_asset_url }}" align="left" width="60" height="60" class="order-list__no-product-image"/>
                    </div>
                  {% endif %}
                </td>
              {% endif %}
            </tr>
            {% if is_nested_line_parent %}
              <tr height="100%">
                <td style="padding: 0px;" height="100%">
                  <table height="100%">
                    <tr>
                      <td height="100%" class="nested-line-item-spacer-cell">
                        <div class="nested-line-item-spacer"></div>
                      </td>
                      <td height="100%" class="parent-vertical-line__cell">
                        <div class="parent-vertical-line__content"></div>
                      </td>
                    </tr>
                  </table>                        
                </td>
              </tr>
            {% endif %}
          </table>
        </td>

        <td class="order-list__product-description-cell">
          {% if line.presentment_title %}
            {% assign line_title = line.presentment_title %}
          {% elsif line.title %}
            {% assign line_title = line.title %}
          {% else %}
            {% assign line_title = line.product.title %}
          {% endif %}
          {% if line.quantity < line.quantity %}
            {% capture line_display %}
              {{ line.quantity }} of {{ line.quantity }}
            {% endcapture %}
          {% else %}
            {% assign line_display = line.quantity %}
          {% endif %}

          <span class="order-list__item-title">{{ line_title }}&nbsp;&times;&nbsp;{{ line_display }}</span><br/>

          {% if line.variant.title != 'Default Title' and is_parent == false %}
            <span class="order-list__item-variant">{{ line.variant.title }}</span><br/>
          {% elsif line.variant.title != 'Default Title' and line.nested_line_parent? %}
            <span class="order-list__item-variant">{{ line.variant.title }}</span><br/>
          {% elsif line.variant.title != 'Default Title' and line.bundle_parent? and true == false %}
            <span class="order-list__item-variant">{{ line.variant.title }}</span><br/>
          {% endif %}

          {% if true %}
            {% for child_line in line.bundle_components %}
              
{% if true %}
  {% assign css_class = 'order-list__bundle-item' %}
  {% assign css_image_class = 'order-list__image-cell' %}
  {% assign css_description_class = 'order-list__product-description-cell' %}
{% else %}
  {% assign css_class = 'order-list__deliverable-item_abandoned' %}
  {% assign css_image_class = 'order-list__image-cell--nested-line-item' %}
  {% assign css_description_class = 'order-list__product-description-cell--nested-line-item' %}
  {% if false %}
    {% assign css_curved_line_cell_container_class = 'curved-line-cell-container__top-spacer-cell--show-border' %}
    {% assign css_hide_vertical_line_class = 'vertical-line__content--hide' %}
    {% assign css_curved_line_cell_container_cell__no_padding_class = 'curved-line-cell-container__cell--no-padding' %}
  {% endif %}
{% endif %}

<table height="100%">
  <tr class="order-list__item">
    <td class="{{ css_class }}" height="100%">
      <table height="100%">
        <td class="{{ css_image_class }}">
          {% if child_line.image %}
            <img src="{{ child_line | img_url: 'compact_cropped' }}" align="left" width="40" height="40" class="order-list__product-image small"/>
          {% else %}
            <div class="order-list__no-image-cell small">
              <img src="{{ 'notifications/no-image.png' | shopify_asset_url }}" align="left" width="20" height="20" class="order-list__no-product-image small"/>
            </div>
          {% endif %}
        </td>

        <td class="{{ css_description_class }}">
          {% if child_line.product.title %}
            {% assign item_title = child_line.product.title %}
          {% else %}
            {% assign item_title = child_line.title %}
          {% endif %}

          {% assign item_display = child_line.quantity %}

            <span class="order-list__item-title">{{ item_display }}&nbsp;&times;&nbsp;{{ item_title }}</span><br>

          {% if child_line.variant.title != 'Default Title'%}
            <span class="order-list__item-variant">{{ child_line.variant.title }}</span>
          {% endif %}
        </td>
      </table>
    </td>
  </tr>
</table>
            {% endfor %}
          {% else %}
            {% for group in line.groups %}
              {% if group.deliverable? %}
                <span class="order-list__item-variant">For: {{ group.display_title }}</span><br/>
              {% else %}
                <span class="order-list__item-variant">Part of: {{ group.display_title }}</span><br/>
              {% endif %}
            {% endfor %}
          {% endif %}


          {% if line.selling_plan_allocation %}
            <span class="order-list__item-variant">{{ line.selling_plan_allocation.selling_plan.name }}</span><br/>
          {% endif %}

          {% if line.refunded_quantity > 0 %}
            <span class="order-list__item-refunded">Refunded</span>
          {% endif %}

          {% if line.discount_allocations %}
            {% for discount_allocation in line.discount_allocations %}
              {% if discount_allocation.discount_application.target_selection != 'all' %}
              <p>
                <span class="order-list__item-discount-allocation">
                  <img src="{{ 'notifications/discounttag.png' | shopify_asset_url }}" width="18" height="18" class="discount-tag-icon" />
                  <span>
                    {{ discount_allocation.discount_application.title | upcase }}
                    (-{{ discount_allocation.amount | money }})
                  </span>
                </span>
              </p>
              {% endif %}
            {% endfor %}
          {% endif %}
        </td>
        {% if line.nested_line_parent? %}
          {% for child_line in line.nested_lines %}
            
{% if false %}
  {% assign css_class = 'order-list__bundle-item' %}
  {% assign css_image_class = 'order-list__image-cell' %}
  {% assign css_description_class = 'order-list__product-description-cell' %}
{% else %}
  {% assign css_class = 'order-list__deliverable-item_abandoned' %}
  {% assign css_image_class = 'order-list__image-cell--nested-line-item' %}
  {% assign css_description_class = 'order-list__product-description-cell--nested-line-item' %}
  {% if forloop.last %}
    {% assign css_curved_line_cell_container_class = 'curved-line-cell-container__top-spacer-cell--show-border' %}
    {% assign css_hide_vertical_line_class = 'vertical-line__content--hide' %}
    {% assign css_curved_line_cell_container_cell__no_padding_class = 'curved-line-cell-container__cell--no-padding' %}
  {% endif %}
{% endif %}

<table height="100%">
  <tr class="order-list__item">
    <td class="{{ css_class }}" height="100%">
      <table height="100%">
          <td class="nested-line-item-spacer-cell"style="padding: 1px;">
            <div class="nested-line-item-spacer"></div>
          </td>
          <td class="curved-line-cell-container" valign="top">
            <div style="width: 0px;">
              <table>
                <tr>
                  <td class="{{ css_curved_line_cell_container_cell__no_padding_class }}" style="mso-padding-right-alt: 10px;">
                    <div class="curved-line-cell-container__top-spacer {{ css_curved_line_cell_container_class }}"></div>
                  </td>
                </tr>
                <tr>
                  <td class="curved-line-cell-container__curvedLine-cell">
                    <div class="curved-line-cell-container__curvedLine-cell__curvedLine"></div>
                  </td>
                </tr>
              </table>
            </div>
          </td>
          <td class="vertical-line" height="100%">
            <div class="vertical-line__content {{ css_hide_vertical_line_class }}"></div>
          </td>
          <td class="nested-line-item-spacer-cell--right">
            <div class="nested-line-item-spacer"></div>
          </td>
        <td class="{{ css_image_class }}">
          {% if child_line.image %}
            <img src="{{ child_line | img_url: 'compact_cropped' }}" align="left" width="40" height="40" class="order-list__product-image small"/>
          {% else %}
            <div class="order-list__no-image-cell small">
              <img src="{{ 'notifications/no-image.png' | shopify_asset_url }}" align="left" width="20" height="20" class="order-list__no-product-image small"/>
            </div>
          {% endif %}
        </td>

        <td class="{{ css_description_class }}">
          {% if child_line.product.title %}
            {% assign item_title = child_line.product.title %}
          {% else %}
            {% assign item_title = child_line.title %}
          {% endif %}

          {% assign item_display = child_line.quantity %}

            <span class="order-list__item-title">{{ item_title }}&nbsp;&times;&nbsp;{{ item_display }}</span><br>

          {% if child_line.variant.title != 'Default Title'%}
            <span class="order-list__item-variant">{{ child_line.variant.title }}</span>
          {% endif %}
        </td>
      </table>
    </td>
  </tr>
</table>
          {% endfor %}
        {% endif %}
      </table>
    </td>
  </tr>

{% endunless %}

    {% endfor %}
  </table>


            </td>
          </tr>
        </table>
      </center>
    </td>
  </tr>
</table>

          <table class="row footer">
            <tr>
              <td class="footer__cell">
                <center>
                  <table class="container">
                    <tr>
                      <td>
                        <p class="disclaimer__subtext">Don't want to receive cart reminders from us? <a href="{{ unsubscribe_url }}">Unsubscribe</a></p>
                      </td>
                    </tr>
                  </table>
                </center>
              </td>
            </tr>
          </table>
          <img src="{{ 'notifications/spacer.png' | shopify_asset_url }}" class="spacer" height="1" />
        </td>
      </tr>
    </table>
  </body>
</html>
