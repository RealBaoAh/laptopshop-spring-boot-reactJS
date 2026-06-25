<%@page contentType="text/html" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>Quản lý tài khoản - Laptopshop</title>
    <meta content="width=device-width, initial-scale=1.0" name="viewport">
    
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600&family=Raleway:wght@600;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.15.4/css/all.css" />
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.4.1/font/bootstrap-icons.css" rel="stylesheet">

    <link href="/client/css/bootstrap.min.css" rel="stylesheet">
    <link href="/client/css/style.css" rel="stylesheet">
</head>

<body>
    <jsp:include page="../layout/header.jsp" />

    <div class="container-fluid page-header py-5" style="margin-top: 80px;">
        <h1 class="text-center text-white display-6">Quản Lý Tài Khoản</h1>
        <ol class="breadcrumb justify-content-center mb-0">
            <li class="breadcrumb-item"><a href="/">Trang chủ</a></li>
            <li class="breadcrumb-item active text-white">Quản lý tài khoản</li>
        </ol>
    </div>
    <div class="container-fluid py-5">
        <div class="container py-5">
            <div class="row g-5">
                <c:if test="${not empty successMessage}">
                    <div class="alert alert-success alert-dismissible fade show" role="alert">
                        ${successMessage}
                        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                    </div>
                </c:if>

                <div class="col-lg-12">
                    <div class="card border-0 shadow-sm rounded-3 p-4">
                        <form action="/profile/update" method="post" enctype="multipart/form-data">
                            <input type="hidden" name="${_csrf.parameterName}" value="${_csrf.token}" />
                            
                            <div class="row">
                                <div class="col-md-4 text-center border-end">
                                    <h4 class="mb-4">Ảnh Đại Diện</h4>
                                    <div class="mb-3">
                                        <img src="/images/avatar/${user.avatar}" id="avatarPreview" 
                                             class="img-fluid rounded-circle shadow-sm" 
                                             style="width: 200px; height: 200px; object-fit: cover;" alt="Avatar">
                                    </div>
                                    <div class="mt-4">
                                        <label for="avatarFile" class="btn btn-outline-primary rounded-pill px-4">
                                            <i class="fas fa-camera me-2"></i> Chọn ảnh mới
                                        </label>
                                        <input class="form-control d-none" type="file" id="avatarFile" name="avatarFile" accept=".png, .jpg, .jpeg" />
                                    </div>
                                </div>

                                <div class="col-md-8 px-md-5">
                                    <h4 class="mb-4">Thông Tin Cá Nhân</h4>
                                    
                                    <div class="mb-4">
                                        <label class="form-label fw-bold">Họ và Tên</label>
                                        <input type="text" class="form-control form-control-lg rounded-pill px-4" name="fullName" value="${user.fullName}" required>
                                    </div>

                                    <div class="mb-4">
                                        <label class="form-label fw-bold">Số Điện Thoại</label>
                                        <input type="text" class="form-control form-control-lg rounded-pill px-4" name="phone" value="${user.phone}">
                                    </div>

                                    <div class="mb-4">
                                        <label class="form-label fw-bold">Địa Chỉ</label>
                                        <input type="text" class="form-control form-control-lg rounded-pill px-4" name="address" value="${user.address}">
                                    </div>

                                    <div class="mb-4">
                                        <label class="form-label fw-bold">Email (Không thể thay đổi)</label>
                                        <input type="email" class="form-control form-control-lg rounded-pill px-4 bg-light" value="${user.email}" disabled>
                                    </div>

                                    <div class="text-end mt-5">
                                        <button type="submit" class="btn btn-primary rounded-pill px-5 py-3 fw-bold text-white">
                                            <i class="fas fa-save me-2"></i> Lưu Thay Đổi
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <jsp:include page="../layout/footer.jsp" />

    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.4/jquery.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0/dist/js/bootstrap.bundle.min.js"></script>

    <script>
        $(document).ready(function() {
            $('#avatarFile').change(function(e) {
                if (e.target.files && e.target.files[0]) {
                    var reader = new FileReader();
                    reader.onload = function(e) {
                        $('#avatarPreview').attr('src', e.target.result);
                    }
                    reader.readAsDataURL(e.target.files[0]);
                }
            });
        });
    </script>
</body>
</html>