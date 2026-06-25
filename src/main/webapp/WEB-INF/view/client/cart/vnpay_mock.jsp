<%@page contentType="text/html" pageEncoding="UTF-8" %>
    <%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
        <%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
            <!DOCTYPE html>
            <html lang="en">

            <head>
                <meta charset="utf-8">
                <title>Cổng Thanh Toán VNPay</title>
                <meta content="width=device-width, initial-scale=1.0" name="viewport">
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0/dist/css/bootstrap.min.css" rel="stylesheet">
                <style>
                    body {
                        background-color: #f8f9fa;
                    }

                    .vnpay-box {
                        max-width: 500px;
                        margin: 100px auto;
                        background: white;
                        padding: 30px;
                        border-radius: 10px;
                        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                    }

                    .vnpay-logo {
                        width: 150px;
                        margin-bottom: 20px;
                    }

                    .amount {
                        font-size: 24px;
                        color: #dc3545;
                        font-weight: bold;
                    }
                </style>
            </head>

            <body>
                <div class="container">
                    <div class="vnpay-box text-center">
                        <img src="https://vnpay.vn/s1/statics.vnpay.vn/2023/6/0oxhzjmxbksr1686814746087.png"
                            class="vnpay-logo" alt="VNPay Logo">
                        <h4>Thanh toán đơn hàng #${orderId}</h4>
                        <p>Số tiền cần thanh toán:</p>
                        <p class="amount">
                            <fmt:formatNumber type="number" value="${amount}" /> VNĐ
                        </p>
                        <hr>
                        <div class="mt-4 mb-4">
                            <p>Quét mã QR để thanh toán:</p>
                            <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=DemoThanhToan_DonHang_${orderId}"
                                alt="QR Code" class="img-thumbnail" style="width: 200px; height: 200px;">
                        </div>

                        <div class="d-grid gap-2 mt-4">
                            <a href="/payment/vnpay-return?orderId=${orderId}&status=success"
                                class="btn btn-primary btn-lg">Xác nhận thanh toán</a>
                            <a href="/payment/vnpay-return?orderId=${orderId}&status=cancel"
                                class="btn btn-outline-danger">Hủy thanh toán</a>
                        </div>
                    </div>
                </div>
            </body>

            </html>