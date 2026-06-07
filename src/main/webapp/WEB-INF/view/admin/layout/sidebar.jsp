<%@page contentType="text/html" pageEncoding="UTF-8"%> <%@ taglib prefix="c"
uri="http://java.sun.com/jsp/jstl/core"%>
<div id="layoutSidenav_nav">
  <nav class="sb-sidenav accordion sb-sidenav-dark" id="sidenavAccordion">
    <div class="sb-sidenav-menu">
      <div class="nav">
        <div class="sb-sidenav-menu-heading">Features</div>
        <a class="nav-link" href="/admin">
          <div class="sb-nav-link-icon">
            <i class="fas fa-tachometer-alt"></i>
          </div>
          Dashboard
        </a>
        <a class="nav-link" href="/admin/user">
          <div class="sb-nav-link-icon">
            <i class="fas fa-tachometer-alt"></i>
          </div>
          User
        </a>
        <a class="nav-link" href="/admin/product">
          <div class="sb-nav-link-icon">
            <i class="fas fa-tachometer-alt"></i>
          </div>
          Product
        </a>
        <a class="nav-link" href="/admin/order">
          <div class="sb-nav-link-icon">
            <i class="fas fa-tachometer-alt"></i>
          </div>
          Order
        </a>
        <div
          class="collapse"
          id="collapseLayouts"
          aria-labelledby="headingOne"
          data-bs-parent="#sidenavAccordion"
        >
          <nav class="sb-sidenav-menu-nested nav">
            <a class="nav-link" href="layout-static.html">Static Navigation</a>
            <a class="nav-link" href="layout-sidenav-light.html"
              >Light Sidenav</a
            >
          </nav>
        </div>
      </div>
    </div>
    <div class="sb-sidenav-footer">
      <div class="small">Logged in as:</div>
      Bảo Anh
    </div>
  </nav>
</div>
