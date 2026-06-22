import 'package:flutter_test/flutter_test.dart';
import 'package:sdkwork_mail_flutter_mobile/app.dart';

void main() {
  testWidgets('renders Mail app sign-in shell', (WidgetTester tester) async {
    await tester.pumpWidget(const MailApp());
    await tester.pumpAndSettle();

    expect(find.text('Mail App Sign In'), findsOneWidget);
    expect(find.text('Continue with Appbase'), findsOneWidget);
  });
}
